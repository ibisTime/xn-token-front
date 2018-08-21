define([
    'app/controller/base',
    'app/interface/UserCtr',
    'app/module/validate',
    'app/module/smsCaptcha',
], function(base, UserCtr, Validate, smsCaptcha) {
	var inviteCode = base.getUrlParam('inviteCode') || '';// 推荐人编号
	var lang = base.getUrlParam('lang') || 'ZH_CN';
    var timer;
	var interCode = '0086'; // 设置默认interCode
	var firstLoad = true;
    
    
	if($("body").get(0).offsetHeight <= $("body").get(0).offsetWidth){
		$("body").height($("body").get(0).offsetHeight + $(".register-from").height());
		$("body").css({"background-position": "initial"});
		$(".register-from").css({"position": "absolute"});
	}
    init();
    
    function init(){
    	base.showLoading();
    	setHtml();
    	getListCountry();
        addListener();
    }
    
    // 根据设置文本
    function setHtml(){
    	$("title").html(base.getText('立即注册',lang));
    	$(".slogan").html(base.getText('THA钱包 (全球首款能分红的跨链钱包)',lang));
    	$("#mobile").attr("placeholder", base.getText('请输入手机号码',lang));
    	$("#smsCaptcha").attr("placeholder", base.getText('请输入验证码',lang));
    	$("#getVerification").html(base.getText('获取验证码',lang));
    	$("#subBtn").html(base.getText('立即注册',lang));
    }
    
    // 列表查询国家
    function getListCountry(){
    	return UserCtr.getListCountry().then((data) => {
    		base.hideLoading();
    		var countryPic = '';
    		var html = ``;
    		var firstCode = '';
    		data.forEach(v => {
    			var on = '';
    			if(v.interCode == '0086' && firstLoad) {
    				countryPic = v.pic;
    				on = 'on';
    				firstCode = v.code;
    				firstLoad = false;
    			}
				html += `<div class="country-list ${on}" data-value="${v.interCode}" data-code="${v.code}" data-pic="${v.pic}" data-lang="${LANGUAGECODELIST[v.interCode] ? LANGUAGECODELIST[v.interCode] : 'EN'}">
							<img class="img" src="${base.getImg(v.pic)}" />
							<samp>${lang == 'ZH_CN' ? v.chineseName : v.interName} +${v.interCode.substring(2)}</samp>
							<i class="icon"></i>
						</div>`;
    		})
    		$("#countryList").html(html);
    		
    		$("#nationalFlag").css({"background-image": `url('${base.getImg(countryPic)}')`});
    		$("#interCode").text('+' + interCode.substring(2)).attr("value", interCode).attr("code", firstCode);
    	}, base.hideLoading);
    }
    
    // 登录
    function register(params){
    	return UserCtr.login(params).then((data) => {
    		base.hideLoading();
    		base.setSessionUser(data);
    		var msg = '';
    		if(data.isRegister){
    			msg = "注册成功！";
    		} else {
    			msg = "您已经是THeia用户，请前往下载APP！";
    		}
    		
    		base.confirm(base.getText(msg,lang),base.getText("取消",lang),base.getText("前往下载",lang)).then(function(){
    			if(lang == 'ZH_CN'){
	    			window.location.href = '../public/download.html';
	    		} else {
	    			window.location.href = '../public/download-'+ lang +'.html';
	    		}
    		},function(){})
    		
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
    	$("#subBtn").click(function(){
    		if(_formWrapper.valid()) {
    			var params = _formWrapper.serializeObject();
    			params.countryCode = $("#interCode").attr("code")
    			params.inviteCode = inviteCode;
    			base.showLoading();
    			register(params);
    		}
    	})
    	
    	$("#rpReceivePopup .close").click(function() {
    		$("#rpReceivePopup").addClass("hidden");
    	})
    	
    	$("#countryPopup .close").click(function() {
    		$("#countryPopup").addClass("hidden");
    	})
    	
    	$("#country-wrap").click(() => {
    		$("#countryPopup").removeClass("hidden");
    	})
    	
    	$("#countryList").on("click", ".country-list", function(){
    		lang = $(this).attr("data-lang");
    		setHtml();
    		$(this).addClass("on").siblings('.country-list').removeClass('on');
    		$("#nationalFlag").css({"background-image": `url('${base.getImg($(this).attr("data-pic"))}')`});
    		$("#interCode").text("+"+$(this).attr("data-value").substring(2)).attr("value", $(this).attr("data-value")).attr("code", $(this).attr("data-code"));
    		$("#countryPopup").addClass("hidden");
    	})
    }
});
