define([
    'app/controller/base',
    'app/interface/RedPacketCtr',
    'app/interface/UserCtr',
    'app/module/validate',
    'app/module/smsCaptcha',
], function(base, RedPacketCtr, UserCtr, Validate, smsCaptcha) {
	var code = base.getUrlParam('code');
	var inviteCode = base.getUrlParam('inviteCode') || '';// 推荐人编号
	var lang = base.getUrlParam('lang');
    var timer;
    var receiverList = [];
	var interCode = '0086'; // 设置默认interCode
	var firstLoad = true;
    
    init();
    
    function init(){
    	if(!code){
    		return;
    	}
        sessionStorage.removeItem("l-return", '');
    	setHtml();
    	
        addListener();
    }
    
    // 设置页面吧、html
    function setHtml(){
    	$("title").html(base.getText('分享红包', lang));
    	$("#rpReceivePopup .popup-header").html(base.getText('输入手机号码<br/>领取红包', lang));
    	
    	$("#mobile").attr("placeholder", base.getText('请输入手机号码', lang));
    	$("#smsCaptcha").attr("placeholder", base.getText('请输入验证码', lang));
    	$("#getVerification").html(base.getText('获取验证码', lang));
    	$("#loginBtn").html(base.getText('领取红包', lang));
    	base.showLoading();
	
		$.when(
    		getRedPacketDetail(),
    		getListCountry()
    	)
    }
    
	// 获取红包详情
    function getRedPacketDetail(){
    	return RedPacketCtr.getRedPacketDetail({code, userId: base.getUserId()}).then((data) => {
    		base.hideLoading();
    		receiverList = data.receiverList || [];
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
    				<div class="txt1">${base.getText('给您发了一个红包', lang)}</div>
					<div class="txt2">${data.greeting}</div>
					<div class="btn" id="openBtn"><div>${openBtnHtml}</div></div>`);
    		} else {
    			var html = ``;
    			
    			if(data.status == '2') {
    				html += `<div class="txt3">${base.getText('红包已派完!', lang)}</div>`;
    			} else {
    				html += `<div class="txt3">${base.getText('红包已过期!', lang)}</div>`;
    			}
    			
    			html += `<div class="goDetail">${base.getText('查看领取情况', lang)}>></div>`;
    			$(".receiveWrap1").html(html);
    		}
    		
    		// 打开红包
	    	$("#openBtn").click(function(){
	    		
	    		// 可领取的红包
	    		if (data.status == '0' || data.status == '1') {
		    		if(!base.isLogin()){
    					$("#rpReceivePopup").removeClass("hidden");
		    		}
	    		}
	    		// 领取过或 红包不可领取  isReceived 是否抢过该红包:0没抢过1:已抢过
	    		if(data.isReceived == '1' || data.status == '2' || data.status == '3' || data.status == '4') {
	    			base.gohref('../redPacket/receive-detail.html?code='+code, lang);
	    			return;
	    		}
		    		
	    	})
	    	
	    	// 打开红包
	    	$(".goDetail").click(function(){
    			base.gohref('../redPacket/receive-detail.html?code='+code, lang);
	    	})
    	}, base.hideLoading)
    }
    
	// 领取
    function receiveRedPacket(){
		RedPacketCtr.receiveRedPacket(code).then(() => {
			base.hideLoading();
			base.gohref('../redPacket/receive-detail.html?code='+code, lang);
		}, base.hideLoading)
    }
    
    // 列表查询国家
    function getListCountry(){
    	return UserCtr.getListCountry().then((data) => {
    		base.hideLoading();
    		var countryPic = '';
    		var html = ``;
    		data.forEach(v => {
    			var on = '';
    			if(v.interCode == '0086' && firstLoad) {
    				countryPic = v.pic;
    				on = 'on';
    				firstLoad = false;
    			}
				html += `<div class="country-list ${on}" data-value="${v.interCode}" data-pic="${v.pic}" data-lang="${LANGUAGECODELIST[v.interCode]}">
							<img class="img" src="${base.getImg(v.pic)}" />
							<samp>${lang == 'ZH_CN' ? v.chineseName : v.interName} +${v.interCode.substring(2)}</samp>
							<i class="icon"></i>
						</div>`;
    		})
    		$("#countryList").html(html);
    		
    		$("#nationalFlag").css({"background-image": `url('${base.getImg(countryPic)}')`});
    		$("#interCode").text('+' + interCode.substring(2)).attr("value", interCode);
    	}, base.hideLoading);
    }
    
    // 登录
    function login(params){
    	return UserCtr.login(params).then((data) => {
    		base.setSessionUser(data);
    		var flag = false; // 是否已抢
    		for(var i in receiverList) {
    			if(receiverList[i].userId == data.userId) {
    				flag = true;
    				break;
    			}
    		}
    		
    		setTimeout(function (){
	    		if(!flag) {
	    			base.showLoading();
	    			receiveRedPacket();
	    		} else {
	    			base.gohref('../redPacket/receive-detail.html?code='+code, lang);
	    		}
    		}, 1200)
        }, () => {
            $("#getVerification").text(base.getText('获取验证码', lang)).prop("disabled", false);
            clearInterval(timer);
        });
    }
    
    function addListener(){
    	var _formWrapper = $("#formWrapper");
        _formWrapper.validate({
            'rules': {
                interCode: {
                    required: true,
                },
                mobile: {
                    required: true,
                    number: true
                },
                smsCaptcha: {
                    required: true,
                    "sms": true
                }
            },
            onkeyup: false
        });
        timer = smsCaptcha.init({
            bizType: '805044'
        });
        
        // 登录
    	$("#loginBtn").click(function(){
    		if(_formWrapper.valid()) {
    			var params = _formWrapper.serializeObject();
    			params.interCode = $("#interCode").attr("value")
    			params.inviteCode = inviteCode;
    			base.showLoading();
    			login(params);
    		}
    	})
    	
    	$("#rpReceivePopup .close").click(function() {
    		$("#rpReceivePopup").addClass("hidden");
    	})
    	
    	$("#countryPopup .close").click(function() {
    		$("#countryPopup").addClass("hidden");
    	})
    	
    	$("#interCode").click((v) => {
    		$("#countryPopup").removeClass("hidden");
    	})
    	
    	$("#countryList").on("click", ".country-list", function(){
    		lang = $(this).attr("data-lang");
    		setHtml();
    		$(this).addClass("on").siblings('.country-list').removeClass('on');
    		$("#nationalFlag").css({"background-image": `url('${base.getImg($(this).attr("data-pic"))}')`});
    		$("#interCode").text("+"+$(this).attr("data-value").substring(2)).attr("value", $(this).attr("data-value"));
    		$("#countryPopup").addClass("hidden");
    	})
    }
});
