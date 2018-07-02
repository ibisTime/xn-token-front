define([
    'app/controller/base',
    'app/interface/RedPacketCtr',
], function(base, RedPacketCtr) {
	var code = base.getUrlParam('code');
	var inviteCode = base.getUrlParam('inviteCode') || '';// 推荐人编号
	var isReceived;// 是否抢过该红包:0没抢过1:一抢过
    
    init();
    
    function init(){
    	if(!code){
    		return;
    	}
        sessionStorage.removeItem("l-return", '');
    	$("title").html(base.getText('分享红包'));
    	$(".rpReceive-wrap .txt1").html(base.getText('给您发了一个红包'));
    	$(".rpReceive-wrap .btn div").html(base.getText('开'));
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
    		$(".rpReceive-wrap .txt2").html(data.greeting);
    		
    		isReceived = data.isReceived;
    		
    		// 已抢
    		if(data.isReceived === '1') {
    			$(".rpReceive-wrap .btn div").html(base.getText('已抢'));
    		} else {
    			$(".rpReceive-wrap .btn div").html(base.getText('开'));
    		}
    	}, base.hideLoading)
    }
    
    function addListener(){
    	// 打开红包
    	$("#openBtn").click(function(){
    		if(!base.isLogin()){
            	sessionStorage.setItem("l-return", location.pathname + location.search);
    			base.gohref('../user/login.html?inviteCode='+ inviteCode);
    			return;
    		}
    		if(isReceived === '1') {
    			base.confirm(base.getText('此红包已抢过啦'));
    			return;
    		}
    		// 领取
    		base.showLoading();
    		RedPacketCtr.receiveRedPacket(code).then(() => {
    			base.hideLoading();
    			base.gohref('../redPacket/receive-detail.html?code='+code);
    		}, base.hideLoading)
    		
    		
    	})
    }
});
