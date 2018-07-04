define([
    'app/controller/base',
    'app/interface/UserCtr',
    'app/module/validate',
    'app/module/smsCaptcha',
], function(base, UserCtr, Validate, smsCaptcha) {
	var inviteCode = base.getUrlParam('inviteCode') || '';// 推荐人编号
    var timer;
    
    init();
    
    function init(){
    	$("title").html(base.getText('登录'));
    	$(".title").html(base.getText('绑定手机号并登录'));
    	$("#getVerification").html(base.getText('获取验证码'));
    	base.showLoading();
    	getListCountry();
    	
        addListener();
    }
    
    // 列表查询国家
    function getListCountry(){
    	return UserCtr.getListCountry().then((data) => {
    		base.hideLoading();
    		var html = `<option value ="">${base.getText("请选择国家")}</option>`;
    		data.forEach(v => {
    			html += `<option value ="${v.interCode}">${v.chineseName}</option>`;
    		})
    		$("#interCode").html(html);
    	}, base.hideLoading);
    }
    
    // 登录
    function login(params){
    	return UserCtr.login(params).then((data) => {
    		base.hideLoading();
    		base.showMsg(base.getText('操作成功！'));
    		base.setSessionUser(data);
    		setTimeout(function() {
    			base.gohref(sessionStorage.getItem("l-return"));
    		}, 1200)
        }, () => {
            $("#getVerification").text("获取验证码").prop("disabled", false);
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
    	
    	$("#interCode").change((v) => {
    		var _this = $("#interCode");
    		
    		$("#interNum").html('+' +_this.val().substring(2));
    	})
    	
    	// 登录
    	$("#loginBtn").click(function(){
    		if(_formWrapper.valid()) {
    			var params = _formWrapper.serializeObject();
    			params.inviteCode = inviteCode;
    			base.showLoading();
    			login(params);
    		}
    	})
    }
});
