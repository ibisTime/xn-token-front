define([
    'app/controller/base',
    'app/interface/RedPacketCtr',
], function(base, RedPacketCtr) {
	var code = base.getUrlParam('code');
	var inviteCode = base.getUrlParam('inviteCode') || '';// 推荐人编号
	var lang = base.getUrlParam('lang');
    
    init();
    
    function init(){
    	if(!code){
    		return;
    	}
        sessionStorage.removeItem("l-return", '');
    	$("title").html(base.getText('分享红包'));
    	base.showLoading();
    	getRedPacketDetail();
    	
        addListener();
    }
    
	// 获取红包详情
    function getRedPacketDetail(){
    	return RedPacketCtr.getRedPacketDetail({code, userId: base.getUserId()}).then((data) => {
    		base.hideLoading();
    		$(".rpReceive-wrap .nickname").html(data.sendUserNickname);
    		$(".rpReceive-wrap .photo div").css({"background-image": "url('"+base.getAvatar(data.sendUserPhoto)+"')"});
    		
    		if (data.status == '0' || data.status == '1') {
    			var openBtnHtml = '';
    			if(data.isReceived === '1') {
	    			openBtnHtml = base.getText('已抢');
	    		} else {
	    			openBtnHtml = base.getText('开');
	    		}
    			$(".receiveWrap1").html(`
    				<div class="txt1">${base.getText('给您发了一个红包')}</div>
					<div class="txt2">${data.greeting}</div>
					<div class="btn" id="openBtn"><div>${openBtnHtml}</div></div>`);
    		} else {
    			$(".receiveWrap1").html(`
    				<div class="txt3">${base.getText('红包已派完!')}</div>
					<div class="goDetail">${base.getText('看看大家的手气')}></div>`);
    		}
    		
    		// 打开红包
	    	$("#openBtn").click(function(){
	    		// 可领取的红包
	    		if (data.status == '0' || data.status == '1') {
		    		if(!base.isLogin()){
		            	sessionStorage.setItem("l-return", location.pathname + location.search);
		    			base.gohref('../user/login.html?inviteCode='+ inviteCode);
		    			return;
		    		}
	    		}
	    		// 领取过或 红包不可领取  isReceived 是否抢过该红包:0没抢过1:已抢过
	    		if(data.isReceived == '1' || data.status == '2' || data.status == '3' || data.status == '4') {
	    			base.gohref('../redPacket/receive-detail.html?code='+code);
	    			return;
	    		}
	    		// 领取
	    		base.showLoading();
	    		RedPacketCtr.receiveRedPacket(code).then(() => {
	    			base.hideLoading();
	    			base.gohref('../redPacket/receive-detail.html?code='+code);
	    		}, base.hideLoading)
	    		
	    	})
	    	
	    	// 打开红包
	    	$(".goDetail").click(function(){
    			base.gohref('../redPacket/receive-detail.html?code='+code);
	    	})
    	}, base.hideLoading)
    }
    
    function addListener(){
    	
    }
});
