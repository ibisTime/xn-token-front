define([
	'jquery',
    'app/util/dialog',
    'app/interface/GeneralCtr',
  	'app/controller/base'
], function ($, dialog, GeneralCtr, Base) {
  var lang = Base.getUrlParam('lang') || 'ZH_CN';
	var tmpl = __inline("index.html");
	var defaultOpt = {};
	var nCaptcha;
	var timer;

	function _showMsg(msg, time) {
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, time || 1500);
    }

	// 请求滑动拼图验证并初始化
	function getSysConfigType(){
    	return GeneralCtr.getSysConfigType('aliyun_fas').then((data) => {
			nCaptchaInit(data.h5_app_key, data.h5_scene_original);
    	}, () => {})
    }

	function getSmsCaptcha() {
		var verification = $("#" + defaultOpt.id);
        verification.prop("disabled", true);
        return GeneralCtr.sendCaptcha(defaultOpt.sendCode,{
        	bizType: defaultOpt.bizType,
        	mobile: $("#" + defaultOpt.mobile).val(),
        	interCode: $("#" + defaultOpt.interCode).attr("value"),
        	ncToken: defaultOpt.ncToken,
        	sessionId: defaultOpt.sessionId,
        	sig: defaultOpt.sig,
        	scene: defaultOpt.scene
        }).then(() => {
            var i = 60;
            if(defaultOpt.mobile === 'email' || defaultOpt.mobile === 'email-find') {
              Base.showMsg(`${Base.getText('验证码已通过邮件的形式发送到您的邮箱里', lang)}`);
						}else {
            	switch(lang) {
								case 'ZH_CN': Base.showMsg(`验证码已通过短信的形式发送到${$("#" + defaultOpt.mobile).val()}手机上`);break;
                case 'EN': Base.showMsg(`验证码已通过短信的形式发送到${$("#" + defaultOpt.mobile).val()}手机上`);break;
                case 'KO': Base.showMsg(`인증번호가 ${$("#" + defaultOpt.mobile).val()}핸드폰에 문자로 발송되었습니다.`);break;
							}
						}
            timer = window.setInterval(() => {
                if(i > 0){
                    verification.text(i-- + "s");
                }else {
                    verification.text(Base.getText('获取验证码', lang)).prop("disabled", false);
                    clearInterval(timer);
                }
            }, 1000);
        }, () => {
            verification.text(Base.getText('获取验证码', lang)).prop("disabled", false);
        });
	}

	function nCaptchaInit(appkey, scene){
		var nc_token = [appkey, (new Date()).getTime(), Math.random()].join(':');
	    var ncWidth = Number($(".nc-wh").width()) > 300 ? Number($(".nc-wh").width()) : 300;
		var ncHeight = Number($(".nc-wh").height());
	    var NC_Opt = {
	        renderTo: "#your-dom-id",
	        appkey: appkey,
	        scene: scene,
	        token: nc_token,
	        trans: {'key1': "code0"},
	        is_Opt: 0,
	        type: "scrape",
	        width: ncWidth.toFixed(0),
	        height: ncHeight.toFixed(0),
	        isEnabled: true,
	        language: 'cn',
	        times: 5,
	        objects: ["http://img.alicdn.com/tps/TB1BT9jPFXXXXbyXFXXXXXXXXXX-80-80.png"],//勿动，照抄即可
	        apimap: {
	            // 'uab_Url': '//aeu.alicdn.com/js/uac/909.js',
	        },
	        elements: [
	            'http://img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png',
	            'http://img.alicdn.com/tfs/TB17cwllsLJ8KJjy0FnXXcFDpXa-50-74.png'
	        ],
	        bg_back_prepared: 'http://img.alicdn.com/tps/TB1skE5SFXXXXb3XXXXXXXXXXXX-100-80.png',
	        bg_front: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABQCAMAAADY1yDdAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAADUExURefk5w+ruswAAAAfSURBVFjD7cExAQAAAMKg9U9tCU+gAAAAAAAAAIC3AR+QAAFPlUGoAAAAAElFTkSuQmCC',
	        obj_ok: 'http://img.alicdn.com/tfs/TB1rmyTltfJ8KJjy0FeXXXKEXXa-50-74.png',
	        bg_back_pass: 'http://img.alicdn.com/tfs/TB1KDxCSVXXXXasXFXXXXXXXXXX-100-80.png',
	        obj_error: 'http://img.alicdn.com/tfs/TB1q9yTltfJ8KJjy0FeXXXKEXXa-50-74.png',
	        bg_back_fail: 'http://img.alicdn.com/tfs/TB1w2oOSFXXXXb4XpXXXXXXXXXX-100-80.png',
	        upLang:{"cn":{
	            _ggk_guide: "请在屏幕上滑动，刮出两面盾牌",
	            _ggk_success: "恭喜您成功刮出盾牌<br/>继续下一步操作吧",
	            _ggk_loading: "加载中",
	            _ggk_fail: ['呀，盾牌不见了<br/>请', "javascript:NoCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
	            _ggk_action_timeout: ['我等得太久啦<br/>请', "javascript:NoCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
	            _ggk_net_err: ['网络实在不给力<br/>请', "javascript:NoCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题'],
	            _ggk_too_fast: ['您刮得太快啦<br/>请', "javascript:NoCaptcha.reset()", '再来一次', '或', "http://survey.taobao.com/survey/QgzQDdDd?token=%TOKEN", '反馈问题']
	            }
	        },
	        callback: function(data) { //成功回调
	            window.console && console.log(nc_token)
	            window.console && console.log(data.sessionId)
	            window.console && console.log(data.sig)

	            var smsCaptchaOption = {
	            	ncToken: nc_token,
	            	sig: data.sig,
	            	sessionId: data.sessionId,
	            	scene: scene,
	            }
	            defaultOpt = {...defaultOpt, ...smsCaptchaOption};
	            smsCaptcha.hideCont(smsCaptchaOption);
	        },
	        failCallback: function(data) { //拦截or失败回调
	            window.console && console.log('fail',data)
	        },
	        error: function(data) { //异常回调
	            window.console && console.log('error',data)
	        }
	    };
	    nCaptcha = NoCaptcha.init(NC_Opt);
	    nCaptcha.setEnabled(true); // 启动
	}

	var smsCaptcha = {
		init: function(option) {
	        this.options = $.extend({}, this.defaultOptions, option);
	        defaultOpt = this.options;
	        getSysConfigType();
	        var temp = $(tmpl);
	        $("body").append(tmpl);

	        var _self = this;
	        $("#" + this.options.id).off("click").on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                _self.options.checkInfo() && _self.showCont();
            });
		},
		defaultOptions: {
	        id: "getVerification",
	        mobile: "mobile",
	        interCode: "interCode",
	        checkInfo: function () {
	    		return $("#" + this.mobile).valid();
	        },
	        sendCode: '805953'
	   },
		showCont: function() {
			if(this.hasCont()) {
				var wrap = $("#ncCaptchaPopup");
				nCaptcha && nCaptcha.reset();
				wrap.removeClass("hidden");
			}
			return this;
		},
		hasCont: function() {
	    	if (!$("#ncCaptchaPopup").length)
	    		return false
	    	return true;
    	},
		hideCont: function(option) {
			if(this.hasCont()) {
				var wrap = $("#ncCaptchaPopup");
				setTimeout(function(){
					wrap.addClass("hidden");
					getSmsCaptcha();
				}, 800)
			}
		},
	}
	return smsCaptcha;
});