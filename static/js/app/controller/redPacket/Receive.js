define([
    'app/controller/base',
    'app/interface/RedPacketCtr',
    'app/interface/UserCtr',
    'app/module/validate',
    'app/module/smsCaptchaNC',
], function(base, RedPacketCtr, UserCtr, Validate, smsCaptcha) {
	var code = base.getUrlParam('code');
	var inviteCode = base.getUrlParam('inviteCode') || '';// 推荐人编号
	var lang = base.getUrlParam('lang');
    var timer;
  var mobileTimer;
  var emailTimer;
    var receiverList = [];
	var interCode = '0086'; // 设置默认interCode
	var firstLoad = true;
	var type = 'mobile'; // 登录类型
    var findType = 'mobile'; // 找回密码类型

    init();

    function init(){
    	if(!code){
    		return;
    	}
      sessionStorage.removeItem("l-return", '');
    	setHtml();
      getListCountry();
      addListener();
    }

    // 设置页面html
    function setHtml(){
    	$("title").html(base.getText('分享红包', lang));

        $(".fy_mobile").html(base.getText('手机号', lang));
        $(".fy_email").html(base.getText('邮箱', lang));
        $(".fy_findMobile").html(base.getText('手机找回', lang));
        $(".fy_findEmail").html(base.getText('邮箱找回', lang));
    	$("#mobile").attr("placeholder", base.getText('请输入手机号码', lang));
        $("#mobile-find").attr("placeholder", base.getText('请输入手机号码', lang));
    	$(".form-mobile .password").attr("placeholder", base.getText('请输入账号登录密码', lang));
      $(".form-mobile .smscap").attr("placeholder", base.getText('请输入验证码', lang));
        $("#email").attr("placeholder", base.getText('请输入您的邮箱账号', lang));
        $("#email-find").attr("placeholder", base.getText('请输入您的邮箱账号', lang));
      $("#passmima").attr("placeholder", base.getText('请输入您的密码', lang));
      $("#qrPassmima").attr("placeholder", base.getText('请确认您的密码', lang));
    	$("#getVerification").html(base.getText('获取验证码', lang));
        $("#loginBtn").html(base.getText('领取红包', lang));
    	$("#rpReceivePopup .textWrap .register").html(base.getText('注册新用户', lang) + '&nbsp;>');
        $("#rpReceivePopup .textWrap .findPwd").html(base.getText('忘记密码', lang) + '&nbsp;>');
        $(".fy_mima").html(base.getText('密码', lang));
      $(".fy_qrmm").html(base.getText('确认密码', lang));
      $(".fy_yzm").html(base.getText('验证码', lang));
      $("#findPwdPopup .popup-content .nextBtn p").html(base.getText('下一步', lang) + '&nbsp;>');
      $("#verification").html(base.getText('获取验证码',lang));
      $("#getEmailVerification").html(base.getText('获取验证码',lang));
      $("#qrBtn").html(base.getText('确定', lang));

    	base.showLoading();
      getRedPacketDetail()
    }

	// 获取红包详情
    function getRedPacketDetail(){
    	return RedPacketCtr.getRedPacketDetail({code, userId: base.getUserId()}).then((data) => {
    		base.hideLoading();
    		receiverList = data.receiverList || [];
    		$(".rpReceive-wrap .nickname").html(`<i>${data.sendUserNickname}</i> ${base.getText('给您发了一个红包', lang)}`);
    		$(".rpReceive-wrap .photo div").css({"background-image": "url('"+base.getAvatar(data.sendUserPhoto)+"')"});

    		if (data.status == '0' || data.status == '1') {
    			var openBtnHtml = '';
    			if(data.isReceived === '1') {
	    			openBtnHtml = base.getText('已抢', lang);
	    		} else {
	    			openBtnHtml = base.getText('开', lang);
	    		}
    			$(".receiveWrap").html(`
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
      			$(".receiveWrap").html(html);
      		}

    		// 打开红包
        $('.rpReceive-bg #openBtn').click(function() {
          // 可领取的红包
	    		if (data.status == '0' || data.status == '1') {
		    		if(!base.isLogin()){
    					$("#rpReceivePopup").removeClass("hidden");
		    		}else {
              receiveRedPacket();
            }
	    		}
	    		// 领取过或 红包不可领取  isReceived 是否抢过该红包:0没抢过1:已抢过
	    		if(data.isReceived == '1' || data.status == '2' || data.status == '3' || data.status == '4') {
	    			base.gohref('../redPacket/receive-detail.html?code='+code, lang);
	    			return;
	    		}
        });

        $('.rpReceive-bg .goDetail').click(function() {
          base.gohref('../redPacket/receive-detail.html?code='+code, lang);
        });

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
    		var firstCode = '';
    		data.forEach(v => {
    			var on = '';
    			if(v.interCode == '0086') {
    				countryPic = v.pic;
    				on = 'on';
    				firstCode = v.code;
    			}
				html += `<div class="country-list ${on}" data-value="${v.interCode}" data-code="${v.code}" data-pic="${v.pic}" data-lang="${LANGUAGECODELIST[v.interCode] ? LANGUAGECODELIST[v.interCode] : 'EN'}">
							<img class="img" src="${base.getImg(v.pic)}" />
							<samp>${lang == 'ZH_CN' ? v.chineseName : v.interName} +${v.interCode.substring(2)}</samp>
							<i class="icon"></i>
						</div>`;
    		})
    		$("#countryList").html(html);

    		// 第一次加载
    		if(firstLoad){
	    		$("#nationalFlag").css({"background-image": "url('"+base.getImg(countryPic)+"')"});
	    		$("#interCode").text('+' + interCode.substring(2)).attr("value", interCode).attr("code", firstCode);
	    		$("#interCode-find").text('+' + interCode.substring(2)).attr("value", interCode).attr("code", firstCode);
				firstLoad = false;
    		}
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
    	var _mobileForm = $("#formWrapperMobile");
        _mobileForm.validate({
            'rules': {
                mobile: {
                    required: true,
                    number: true
                },
                password: {
                    required: true
                }
            },
            onkeyup: false
        });

        var _emailForm = $("#formWrapperEmail");
        _emailForm.validate({
            'rules': {
                email: {
                    required: true,
                    email: true
                },
                password: {
                    required: true
                }
            },
            onkeyup: false
        });

      var _findPwdMobileForm = $("#findPwdMobileForm");
      var findPwdMobileData = null;
      _findPwdMobileForm.validate({
        'rules': {
          mobile: {
            required: true,
            number: true
          },
          smsCaptcha: {
            required: true
          }
        },
        onkeyup: false
      });
      // 手机号验证码
      mobileTimer = smsCaptcha.init({
        id: "verification",
        bizType: '805076',
        mobile: 'mobile-find',
        sendCode: '805953'
      });

      var _findPwdEmailForm = $("#findPwdEmailForm");
      var findPwdEmailData = null;
      _findPwdEmailForm.validate({
        'rules': {
          email: {
            required: true,
            email: true
          },
          smsCaptchaEmail: {
            required: true
          }
        },
        onkeyup: false
      });

      var _qrPwdForm = $("#qrPwdForm");
      var qrPwdData = null;
      _qrPwdForm.validate({
        'rules': {
          pass: {
            required: true
          },
          qrPass: {
            required: true
          }
        },
        onkeyup: false
      });

        // 领取
    	$("#loginBtn").click(function(){
            var params = {};
            // 手机
            if(type === 'mobile') {
                if (_mobileForm.valid()) {
                    var data = _mobileForm.serializeObject();
                    params.loginName = $("#interCode").attr("value") + '' + data.mobile;
                    params.loginPwd = data.password;
                    base.showLoading();
                    login(params);
                }
            }else if(type === 'email') {
                if (_emailForm.valid()) {
                    var data = _emailForm.serializeObject();
                    params.loginName = data.email;
                    params.loginPwd = data.password;
                    base.showLoading();
                    login(params);
                }
            }
    	})

        // 领取弹窗 - 关闭
    	$("#rpReceivePopup .close").click(function() {
    		$("#rpReceivePopup").addClass("hidden");
    	})

        // 国家弹窗- 关闭
    	$("#countryPopup .close").click(function() {
    		$("#countryPopup").addClass("hidden");
    	});

        // 国家选择 点击
    	$("#interCode").click(() => {
    		$("#countryPopup").removeClass("hidden");
    	});

      // 国家选择 点击
      $("#interCode-find").click(() => {
        $("#countryPopup").removeClass("hidden");
      });

        // 国家弹窗 - 点击
    	$("#countryList").on("click", ".country-list", function(){
    		lang = $(this).attr("data-lang");
    		interCode = $(this).attr("data-value");
    		setHtml();
    		if($(this).index() > 0) {
    		  $('.popup-header').css('font-size', '0.3rem');
        }
    		$(this).addClass("on").siblings('.country-list').removeClass('on');
    		$("#nationalFlag").css({"background-image": "url('"+base.getImg($(this).attr("data-pic"))+"')"});
        $("#interCode").text("+"+$(this).attr("data-value").substring(2)).attr("value", $(this).attr("data-value")).attr("code", $(this).attr("data-code"));
        $("#interCode-find").text("+"+$(this).attr("data-value").substring(2)).attr("value", $(this).attr("data-value")).attr("code", $(this).attr("data-code"));
    		$("#countryPopup").addClass("hidden");
    	})

        // 领取弹窗 切换登录方式
		$("#rpReceivePopup .popup-header .item").click(function () {
		    var thisType = $(this).attr('data-type');
			if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings().removeClass('active');
			}
			if (thisType !== type) {
                type = thisType;
                if (thisType === 'mobile') {
                    $('#formWrapperEmail').addClass('hidden').validate().resetForm();
                    $('#formWrapperMobile').removeClass('hidden');
                } else if (thisType === 'email') {
                    $('#formWrapperMobile').addClass('hidden').validate().resetForm();
                    $('#formWrapperEmail').removeClass('hidden');
                }
            }
        })

        // 登录弹窗-注册
        $("#rpReceivePopup .textWrap .register").click(function () {
        		var uhref = location.href;
        		sessionStorage.setItem('uhref', uhref);
            base.gohref('../user/register.html?inviteCode='+ inviteCode, lang);
        })

        //  登录弹窗-找回密码
        $("#rpReceivePopup .textWrap .findPwd").click(function () {
            $("#findPwdPopup").removeClass('hidden');
        })

        // 找回密码弹窗 - 关闭
        $("#findPwdPopup .close").click(function() {
            $("#findPwdPopup").addClass("hidden");
        })

        // 找回密码弹窗 切换方式
        $("#findPwdPopup .popup-header .item").click(function () {
            var thisType = $(this).attr('data-type');
            if (!$(this).hasClass('active')) {
                $(this).addClass('active').siblings().removeClass('active');
            }
            if (thisType !== findType) {
                findType = thisType;
                if (thisType === 'mobile') {
                    $('#findPwdEmailForm').addClass('hidden').validate().resetForm();
                    $('#findPwdMobileForm').removeClass('hidden');
                    $('#email-find').val('');
                    $('#smsCaptchaEmail').val('');
                    findPwdEmailData = null;
                } else if (thisType === 'email') {
                    // 邮箱验证码
                    emailTimer = smsCaptcha.init({
                      id: "getEmailVerification",
                      bizType: '805076',
                      mobile: 'email-find',
                      sendCode: '805954'
                    });
                    $('#findPwdMobileForm').addClass('hidden').validate().resetForm();
                    $('#findPwdEmailForm').removeClass('hidden');
                    $('#mobile-find').val('');
                    $('#smsCaptcha').val('');
                    findPwdMobileData = null;
                }
              $('#qrPwdForm').addClass('hidden');
							$('#passmima').val('');
              $('#qrPassmima').val('');
            }
        });

    		// 找回密码--下一步
				$('.nextBtn p').click(function() {
					if($('.fy_findMobile').hasClass('active')) {
						if(_findPwdMobileForm.valid()) {
              findPwdMobileData = _findPwdMobileForm.serializeObject();
              $('#findPwdEmailForm').addClass('hidden');
              $('#findPwdMobileForm').addClass('hidden');
              $('#qrPwdForm').removeClass('hidden');
              $('.nextBtn').addClass('hidden');
              $('.login-btn').removeClass('hidden');
						}
					}else {
            if(_findPwdEmailForm.valid()) {
              findPwdEmailData = _findPwdEmailForm.serializeObject();
              $('#findPwdEmailForm').addClass('hidden');
              $('#findPwdMobileForm').addClass('hidden');
              $('#qrPwdForm').removeClass('hidden');
              $('.nextBtn').addClass('hidden');
              $('.login-btn').removeClass('hidden');
            }
					}
				});

				// 找回密码 - 确认
				$('#qrBtn').click(function() {
					let params = {};
          if(_qrPwdForm.valid()) {
          	if($('#passmima').val() !== $('#qrPassmima').val()) {
          		base.showMsg(base.getText('密码不一致，请重新输入', lang));
              $('#passmima').val('');
              $('#qrPassmima').val('');
              return;
						}
            qrPwdData = _qrPwdForm.serializeObject();
            console.log(findPwdEmailData, findPwdMobileData, qrPwdData);
          	if(findPwdMobileData) {
          		params.loginName = $("#interCode-find").attr("value") + findPwdMobileData.mobile;
          		params.smsCaptcha = findPwdMobileData.smsCaptcha;
          		params.newLoginPwd = qrPwdData.qrPass;
						}else {
              params.loginName = findPwdEmailData.email;
              params.smsCaptcha = findPwdEmailData.smsCaptchaEmail;
              params.newLoginPwd = qrPwdData.qrPass;
						}
            base.showLoading();
            UserCtr.getUserPass(params).then(data => {
              base.hideLoading();
              base.showMsg(base.getText('重置密码成功', lang));
              clearInterval(emailTimer);
              clearInterval(mobileTimer);
              setTimeout(() => {
                window.location.reload();
              }, 1200);
            }, (err) => {
              base.hideLoading();
              return;
              if(err === base.getText('用户不存在,请先注册', lang)) {
                var uhref = location.href;
                sessionStorage.setItem('uhref', uhref);
                setTimeout(() => {
                  base.gohref('../user/register.html?inviteCode='+ inviteCode, lang);
                }, 1500);
              };
            });
					}
				});
    }
});
