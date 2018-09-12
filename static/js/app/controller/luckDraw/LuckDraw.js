define([
    'app/controller/base',
    'app/util/ajax',
    'app/interface/BizCtr',
    'app/interface/UserCtr',
], function(base, Ajax, BizCtr, UserCtr) {
	var userId = base.getUrlParam("userId") || 'ZH_CN';
	var prize = 1; // 中奖序号
	
    init();
    
    function init() {
		setHtml();
		addListener();
    }
    
    // 设置页面html
    function setHtml(){
//		base.showLoading()
    	$("title").html(base.getText('抽奖'));
    	$('.luckDraw-top').html(`<p>${base.getText('您拥有积分')}<samp>100</samp>${base.getText('分')}，${base.getText('可抽奖')}<span>2</span>${base.getText('次')}</p>`)
    }
    
    // 抽奖
    function luckDraw(){
    	return BizCtr.luckDraw(userId).then((data) =>{
    		tigerGameFun().startAction();
    	}, ()=>{})
    }
    
    function tigerGameFun(){
    	var tigerGame = {
			params: null,
			init: function() {
				tigerGame.params = {
					num: {
						circle: 4,
						lap: 8,
						// 由于是从8(下标7)开始，实际获奖index = index - prize + 1 
						prize: 7 - prize + 1
					},
					step: {
						total: 0,
						fast: 0,
						slow: 8
					},
					speed: {
						fast: 100,
						slow: 200
					},
					index: 7
				}
			},
			startAction: function() {
				tigerGame.init();
				$(".lotteryBtn").unbind("click");
				tigerGame.params.step.total = tigerGame.params.num.circle * tigerGame.params.num.lap + tigerGame.params.num.prize;
				tigerGame.goAction();
			},
			goAction: function() {
				if(tigerGame.params.step.total <= 0) {
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
				if(tigerGame.params.step.total > tigerGame.params.step.slow) {
					setTimeout(tigerGame.goAction, tigerGame.params.speed.fast);
				} else {
					setTimeout(tigerGame.goAction, tigerGame.params.speed.slow);
					tigerGame.params.speed.slow += 80;
				}
				tigerGame.params.step.total--;
				tigerGame.params.index--;
				if(tigerGame.params.index == 0) {
					tigerGame.params.index = 8;
				}
			},
			overAction: function() {
				$(".lotteryBtn").bind("click", tigerGame.startAction);
				tigerGame.init();
			}
		};
    	return tigerGame;
    }
	
    function addListener(){
		// 抽奖按钮
		$(".lotteryBtn").bind("click", function(){
			luckDraw();
		});
		
		// 弹窗-关闭
		$("#luckDrawPopup .close").click(function(){
			$("#luckDrawPopup").addClass("hidden");
		});
    }
});