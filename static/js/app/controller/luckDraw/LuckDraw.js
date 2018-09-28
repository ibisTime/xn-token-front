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
	var timer;
	
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
		prize = null; // 中奖序号
		luckDrawFalg = false; // 是否可以抽奖
		
		if(!userId){
			base.showMsg("userId不能为空");
			return;
		}
		setHtml();
		base.showLoading();
		$.when(
			getListPrizeWinner(),
			getSysConfigKey()
		).then(base.hideLoading, base.hideLoading)
		addListener();
	}

	// 设置页面html
	function setHtml() {
		$("title").html(base.getText('抽奖'));
		$("#lotteryBtn").html(`<img src="/static/images/start_${NOWLANG}.png" />`);
		$("#luckDrawPopup .close").html(base.getText('知道了'));
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
			var data = {prizeId: '1'};
			prize = Number(prizeIndex[data.prizeId]);
			var count = $("#prizeWrapper .prize"+ data.prizeId +" .quantity").text();
			var symbol = $("#prizeWrapper .prize"+ data.prizeId +" .symbol").text();
			
			$("#luckDrawPopup .content").html(`<p class="quantity"><samp class="count">${count}</samp></p>
				<p class="congratulations">${base.getText('恭喜您')},${base.getText('获得')}<samp class="count">${count}</samp><samp class="symbol">${symbol}</samp></p>`)
		}, () => {})
	}

	// 查询用户信息
	function getUserInfo(cost) {
		return UserCtr.getUserInfo(userId).then((data) => {
			if((String(data.jfAmount/cost)).split(".")[0] > 0) {
				luckDrawFalg = true;
			} else {
				luckDrawFalg = false;
			}
			$('.luckDraw-top').html(`<p>${base.getText('您拥有')}<samp>${data.jfAmount}</samp>${base.getText('积分')}，${base.getText('可抽奖')}<span>${(String(data.jfAmount/cost)).split(".")[0]}</span>${base.getText('次')}</p>`)
			
			// 抽奖按钮
			$(".lotteryBtn").off("click").bind("click", function() {
				base.showMsg(base.getText("系统升级中")+'...', 1200);
				
//				if(!luckDrawFalg){
//					base.showMsg(base.getText("积分余额不足"));
//					return;
//				}
//				tigerGameFun().startAction();
//				
//				setTimeout(function(){
//					luckDraw();
//				}, 500);
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
				$("#winnerList2").html(html);
				
//				if(data.length >= 4) {
//					scrollTop();
//				}
			}
		}, () => {})
	}

	function buildHtml(item) {
		return `<div class="item">${base.getText('恭喜用户')}：<samp>${item.mobile}</samp>${base.getText('获得')} ${item.count}${item.symbol}</div>`;
	}

	// 中奖名单无缝滚动
	function scrollTop() {
		clearInterval(timer);
		var speed = 40;
		var winnerList = document.getElementById('winnerListWrap');
		var winnerList1 = document.getElementById('winnerList1');
		var winnerList2 = document.getElementById('winnerList2');

		function Marquee() {
			if(winnerList2.offsetTop - winnerList.scrollTop <= 0){
				winnerList.scrollTop = winnerList1.offsetHeight
			} else {
				winnerList.scrollTop++;
			}
		}
		timer = setInterval(Marquee, speed);
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
				if((prize || prize==0) && !tigerGame.params.step.total && tigerGame.params.step.total !=0){
					tigerGame.params.step.total = tigerGame.params.num.circle * tigerGame.params.num.lap + prize - tigerGame.params.index + 1;
					console.log(prize, tigerGame.params.index);
				}
				if(tigerGame.params.step.total == 0) {
					tigerGame.overAction();
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
				$(".lotteryBtn").off("click").bind("click", tigerGame.startAction);
				tigerGame.init();
			}
		};
		return tigerGame;
	}
	
	function addListener() {

		// 弹窗-关闭
		$("#luckDrawPopup .close").off("click").bind("click", function() {
			$("#luckDrawPopup").addClass('hidden');
			init();
		});
	}
});