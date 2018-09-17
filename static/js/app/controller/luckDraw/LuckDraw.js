define([
	'app/controller/base',
	'app/util/ajax',
	'app/interface/BizCtr',
	'app/interface/UserCtr',
	'app/interface/GeneralCtr',
], function(base, Ajax, BizCtr, UserCtr, GeneralCtr) {
	var userId = base.getUrlParam("userId") || '';
	var prize = null; // 中奖序号
	var luckDrawFalg = false; // 是否可以抽奖
	
	// 实际奖品顺序
	var prizeIndex = {
		'1': '1',
		'8': '2',
		'7': '3',
		'2': '8',
		'6': '4',
		'3': '7',
		'4': '6',
		'5': '5',
	}

	init();

	function init() {
		if(!userId){
			base.showMsg("userId不能为空");
			return;
		}
		setHtml();
		$.when(
			getListPrizeWinner(),
			getSysConfigKey()
		)
		addListener();
	}

	// 设置页面html
	function setHtml() {
		//		base.showLoading()
		$("title").html(base.getText('抽奖'));
	}

	// 获取数据字典
	function getSysConfigKey() {
		return GeneralCtr.getSysConfigKey('lottery_cost').then((data) => {
			getUserInfo(data.cvalue);
		}, () => {})
	}

	// 抽奖
	function luckDraw() {
		return BizCtr.luckDraw(userId).then((data) => {
			prize = Number(prizeIndex[data.prizeId]);
		}, () => {})
	}

	// 查询用户信息
	function getUserInfo(cost) {
		return UserCtr.getUserInfo(userId).then((data) => {
			if((String(data.jfAmount/cost)).split(".")[0] > 0) {
				luckDrawFalg = true;
			}
			$('.luckDraw-top').html(`<p>${base.getText('您拥有')}<samp>${data.jfAmount}</samp>${base.getText('积分')}，${base.getText('可抽奖')}<span>${(String(data.jfAmount/cost)).split(".")[0]}</span>${base.getText('次')}</p>`)
			
			// 抽奖按钮
			$(".lotteryBtn").bind("click", function() {
				if(!luckDrawFalg){
					base.showMsg(base.getText("积分余额不足"));
					return;
				}
				tigerGameFun().startAction();
				
				setTimeout(function(){
					luckDraw();
				}, 500);
			});
		}, () => {})
	}

	// 获取中奖名单
	function getListPrizeWinner() {
		return BizCtr.getListPrizeWinner(userId).then((data) => {
			if (data.length > 0) {
				var html = '';
				data.forEach((v) => {
					html += buildHtml(v);
				})
				$("#winnerList1").html(html);
				scrollTop();
			}
		}, () => {})
	}

	function buildHtml(item) {
		return `<div class="item">${base.getText('恭喜用户')}：<samp>${item.mobile}</samp>${base.getText('获得')}${item.count}${item.symbol}</div>`;
	}

	// 中奖名单无缝滚动
	function scrollTop() {
		var speed = 40;
		var winnerList = document.getElementById('winnerListWrap');
		var winnerList1 = document.getElementById('winnerList1');
		var winnerList2 = document.getElementById('winnerList2');
		winnerList2.innerHTML = winnerList1.innerHTML;

		function Marquee() {
			if(winnerList2.offsetTop - winnerList.scrollTop <= 0){
				winnerList.scrollTop = winnerList1.offsetHeight
			} else {
				winnerList.scrollTop++;
			}
		}
		var timer = setInterval(Marquee, speed);

	}

	// 抽奖跑马灯
	function tigerGameFun() {
		var tigerGame = {
			params: null,
			init: function() {
				tigerGame.params = {
					num: {
						circle: 4,
						lap: 8,
					},
					step: {
						total: null,
						fast: 0,
						slow: 8
					},
					speed: {
						fast: 100,
						slow: 200
					},
					index: 2
				}
			},
			startAction: function() {
				tigerGame.init();
				$(".lotteryBtn").unbind("click");

				tigerGame.goAction();
			},
			goAction: function() {
				console.log(tigerGame.params.step.total);
				if((prize || prize==0) && !tigerGame.params.step.total && tigerGame.params.step.total !=0){
					tigerGame.params.step.total = tigerGame.params.num.circle * tigerGame.params.num.lap + prize - tigerGame.params.index + 1;
					console.log(prize, tigerGame.params.index);
				}
				if(tigerGame.params.step.total == 0) {
					tigerGame.overAction();
					$("#luckDrawPopup .count").html($("#prizeWrapper .prize.active .quantity").text());
					$("#luckDrawPopup .symbol").html($("#prizeWrapper .prize.active .symbol").text());
					$("#luckDrawPopup").removeClass('hidden');
					return false;
				}

				$(".prize").removeClass("active");
				$(".prize").each(function() {
					if($(this).attr("index") == tigerGame.params.index) {
						$(this).addClass("active");
					}
				});
				if(!prize && prize!=0) {
					setTimeout(tigerGame.goAction, tigerGame.params.speed.fast);
				} else {
					if(tigerGame.params.step.total > tigerGame.params.step.slow) {
						setTimeout(tigerGame.goAction, tigerGame.params.speed.fast);
					} else {
						setTimeout(tigerGame.goAction, tigerGame.params.speed.slow);
						tigerGame.params.speed.slow += 80;
					}
					tigerGame.params.step.total--;
				}	
				tigerGame.params.index ++;
				if(tigerGame.params.index==9){
					tigerGame.params.index = 1;
				}
			},
			overAction: function() {
				$(".lotteryBtn").bind("click", tigerGame.startAction);
				tigerGame.init();
			}
		};
		return tigerGame;
	}
	
	function addListener() {

		// 弹窗-关闭
		$("#luckDrawPopup .close").click(function() {
			location.reload(true);
		});
	}
});