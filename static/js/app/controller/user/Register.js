define([
    'app/controller/base',
    'app/interface/UserCtr',
    'app/module/validate',
    'app/module/smsCaptchaNC',
    'app/interface/GeneralCtr'
], function(base, UserCtr, Validate, smsCaptcha, GeneralCtr) {
	var inviteCode = base.getUrlParam('inviteCode') || '';// 推荐人编号
	var lang = base.getUrlParam('lang') || 'ZH_CN';
	var timer;
	var emailTimer;
	var interCode = '0086'; // 设置默认interCode
	var firstLoad = true;
	var nc_tmpl = {};

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
    	$(".slogan").html(base.getText('Theia钱包 (全球首款能分红的跨链钱包)',lang));
    	$("#mobile").attr("placeholder", base.getText('请输入手机号码',lang));
      $("#email").attr("placeholder", base.getText('请输入邮箱号',lang));
    	$("#smsCaptcha").attr("placeholder", base.getText('请输入验证码',lang));
      $("#smsCaptchaEmail").attr("placeholder", base.getText('请输入验证码',lang));
      $("#zhpas").attr("placeholder", base.getText('请输入您的账号密码',lang));
      $("#qr_zhpas").attr("placeholder", base.getText('请确认您的账号密码',lang));
      $("#zjpas").attr("placeholder", base.getText('请输入您的资金密码',lang));
      $("#qr_zjpas").attr("placeholder", base.getText('请确认您的资金密码',lang));
    	$("#getVerification").html(base.getText('获取验证码',lang));
      $("#getEmailVerification").html(base.getText('获取验证码',lang));
    	$("#subBtn").html(base.getText('立即注册',lang));
      $(".chan-left").html(base.getText('手机注册',lang));
      $(".chan-right").html(base.getText('邮箱注册',lang));
      $(".national-email").html(base.getText('邮箱',lang));
      $(".next-to span").html(base.getText('下一步',lang));
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
    function register(params, type){
    	let loginParams = {
    		client: params.client,
        loginName: '',
        loginPwd: params.loginPwd
			};
    	if(type === 'mobile') {
    		loginParams.loginName = params.countryCode + params.mobile;
        doRegister(params, 'mobile');
        UserCtr.mobileRegister(params).then(data => {
          doRegister(data);
				}, () => {
          $("#getVerification").text(base.getText('获取验证码', lang)).prop("disabled", false);
          clearInterval(timer);
        });
			}
			if(type === 'email') {
        loginParams.loginName = params.email;
        UserCtr.emailRegister(params).then(data => {
          doRegister(data);
        }, () => {
          $("#getVerification").text(base.getText('获取验证码', lang)).prop("disabled", false);
          clearInterval(emailTimer);
        })
			}
    }
		function doRegister(data) {
      var uhref = sessionStorage.getItem('uhref') || '';
      base.hideLoading();
      base.setSessionUser(data);
      var msg = '';
      if(data.isRegister){
        msg = base.getText("注册成功！",lang);
      } else {
        msg = base.getText("您已经是Theia用户，请前往下载APP！",lang);
      }
      base.confirm(base.getText(msg,lang),base.getText("取消",lang),base.getText("前往下载",lang)).then(function(){
        if(lang == 'ZH_CN'){
          window.location.href = DOWNLOADLINK+'.html';
        } else {
          window.location.href = DOWNLOADLINK+'-'+ lang +'.html';
        }
      },function(){
        if(uhref) {
          base.showLoading();
          window.location.href = uhref;
        }
      })
    }

    function addListener(){
    	var _formWrapper = $("#formWrapper");
      var _formWrapper1 = $("#formWrapper1");
      var _formWrapper2 = $("#formWrapper2");
      var _formWrapperEmail = $("#formWrapperEmail");
      var formWrapperData = null;
      var formWrapper1Data = null;
      var formWrapper2Data = null;
      var formWrapperEmailData = null;
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
      _formWrapper1.validate({
        'rules': {
          zhpas: {
            required: true
          },
          qr_zhpas: {
            required: true
          }
        },
        onkeyup: false
      });
      _formWrapper2.validate({
        'rules': {
          zjpas: {
            required: true
          },
          qr_zjpas: {
            required: true
          }
        },
        onkeyup: false
      });
      _formWrapperEmail.validate({
        'rules': {
          email: {
            required: true,
            email: true
          },
          smsCaptchaEmail: {
            required: true,
            "sms": true
          }
        },
        onkeyup: false
      });

      // 手机号验证码
			timer = smsCaptcha.init({
          id: "getVerification",
					bizType: '805045',
        	mobile: 'mobile',
          sendCode: '805953'
			});

        // 验证码下一步
			$('.next-to span').click(function(){
				if($('#formWrapper1').hasClass('hidden')) {
					if($('.chan-right').hasClass('set-chan')) {
            if(_formWrapperEmail.valid()) {
              formWrapperEmailData = _formWrapperEmail.serializeObject();
              $('#formWrapper').addClass('hidden');
              $('#formWrapperEmail').addClass('hidden');
              $('.smsCaptcha-box').addClass('hidden');
              $('#formWrapper1').removeClass('hidden');
            }
					}else {
            if(_formWrapper.valid()) {
              formWrapperData = _formWrapper.serializeObject();
              $('#formWrapper').addClass('hidden');
              $('#formWrapperEmail').addClass('hidden');
              $('.smsCaptcha-box').addClass('hidden');
              $('#formWrapper1').removeClass('hidden');
            }
					}
				}else if($('#formWrapper').hasClass('hidden') || $('#formWrapperEmail').hasClass('hidden') && !$('#formWrapper1').hasClass('hidden')) {
          if(_formWrapper1.valid()) {
            formWrapper1Data = _formWrapper1.serializeObject();
            if($('#zhpas').val() !== $('#qr_zhpas').val()) {
              base.showMsg(base.getText('密码不一致，请重新输入', lang));
              $('#zhpas').val('');
              $('#qr_zhpas').val('');
            }else {
              $('#formWrapper2').removeClass('hidden');
              $('#formWrapper1').addClass('hidden');
              $('.next-to').addClass('hidden');
              $('.btnWrap').removeClass('hidden');
            }
          }
				}
			});

			// 切换登录方式
			// 短信
			$('.chan-left').click(function() {
        $(this).addClass('set-chan');
        $('.chan-right').removeClass('set-chan');
				$('#formWrapper').removeClass('hidden');
        $('.smsCaptcha-box').removeClass('hidden');
        $('#formWrapperEmail').addClass('hidden').validate().resetForm();
        $('#formWrapper2').addClass('hidden').validate().resetForm();
        $('#formWrapper1').addClass('hidden').validate().resetForm();
        $('.next-to').removeClass('hidden');
        $('.btnWrap').addClass('hidden');

        // 清空
				$('#email').val('');
        $('#smsCaptchaEmail').val('');
        $('#zhpas').val('');
        $('#qr_zhpas').val('');
        $('#zjpas').val('');
        $('#qr_zjpas').val('');

        // 重置
        formWrapperEmailData = null;
			});

			// 邮箱
      $('.chan-right').click(function() {
        // 邮箱验证码
        emailTimer = smsCaptcha.init({
          id: "getEmailVerification",
          bizType: '805046',
          mobile: 'email',
          sendCode: '805954'
        });
      	$(this).addClass('set-chan');
        $('.chan-left').removeClass('set-chan');
        $('.smsCaptcha-box').removeClass('hidden');
        $('#formWrapperEmail').removeClass('hidden');
        $('#formWrapper').addClass('hidden').validate().resetForm();
        $('#formWrapper2').addClass('hidden').validate().resetForm();
        $('#formWrapper1').addClass('hidden').validate().resetForm();
        $('.next-to').removeClass('hidden');
        $('.btnWrap').addClass('hidden');

        // 清空
        $('#mobile').val('');
        $('#smsCaptcha').val('');
        $('#zhpas').val('');
        $('#qr_zhpas').val('');
        $('#zjpas').val('');
        $('#qr_zjpas').val('');

        // 重置
        formWrapperData = null;
      });

        // 登录
    	$("#subBtn").click(function(){
    		if(_formWrapper2.valid()) {
          if($('#zjpas').val() !== $('#qr_zjpas').val()) {
            base.showMsg(base.getText('密码不一致，请重新输入', lang));
            $('#zjpas').val('');
            $('#qr_zjpas').val('');
          }else{
            formWrapper2Data = _formWrapper2.serializeObject();
            if(formWrapperData) {  // 手机注册
              let params = {
                client: 'WEB_H5'
              };
              params.countryCode = $("#interCode").attr("code");
              params.inviteCode = inviteCode;
              params.mobile = formWrapperData.mobile;
              params.loginPwd = formWrapper1Data.zhpas;
              params.tradePwd = formWrapper2Data.zjpas;
              params.smsCaptcha = formWrapperData.smsCaptcha;
              register(params, 'mobile');
            }else{  // 邮箱注册
              let params = {
                client: 'WEB_H5'
              };
              params.inviteCode = inviteCode;
              params.email = formWrapperEmailData.email;
              params.loginPwd = formWrapper1Data.zhpas;
              params.tradePwd = formWrapper2Data.zjpas;
              params.smsCaptcha = formWrapperEmailData.smsCaptchaEmail;
              register(params, 'email');
            }
          }
    		}
    	});

    	$("#rpReceivePopup .close").click(function() {
    		$("#rpReceivePopup").addClass("hidden");
    	});

    	$("#countryPopup .close").click(function() {
    		$("#countryPopup").addClass("hidden");
    	});

    	$("#country-wrap").click(() => {
    		$("#countryPopup").removeClass("hidden");
    	});

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
