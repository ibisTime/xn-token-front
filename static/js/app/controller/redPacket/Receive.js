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
    var receiverList = [];
	var interCode = '0086'; // 设置默认interCode
	var firstLoad = true;
	var type = 'mobile'; // 登录类型

    init();

    function init(){
    	if(!code){
    		return;
    	}
        sessionStorage.removeItem("l-return", '');
    	setHtml();

        addListener();
    }

    // 设置页面html
    function setHtml(){
    	$("title").html(base.getText('分享红包', lang));

        $(".fy_mobile").html(base.getText('手机号', lang));
        $(".fy_email").html(base.getText('邮箱', lang));
    	$("#mobile").attr("placeholder", base.getText('请输入手机号码', lang));
    	$(".form-mobile .password").attr("placeholder", base.getText('请输入登录密码', lang));
        $("#email").attr("placeholder", base.getText('请输入您的邮箱账号', lang));
    	$("#getVerification").html(base.getText('获取验证码', lang));
    	$("#loginBtn").html(base.getText('领取红包', lang));
        $(".fy_mima").html(base.getText('密码', lang));

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
    		$(".rpReceive-wrap .nickname").html(`<i>${data.sendUserNickname}</i> ${base.getText('给您发了一个红包')}`);
    		$(".rpReceive-wrap .photo div").css({"background-image": "url('"+base.getAvatar(data.sendUserPhoto)+"')"});

    		if (data.status == '0' || data.status == '1') {
    			var openBtnHtml = '';
    			if(data.isReceived === '1') {
	    			openBtnHtml = base.getText('已抢');
	    		} else {
	    			openBtnHtml = base.getText('开');
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

        // 领取
    	$("#loginBtn").click(function(){
            var params = {};
            // 手机
            if(type === 'mobile') {
                if (_mobileForm.valid()) {
                    var data = _mobileForm.serializeObject();
                    params.loginName = $("#interCode").attr("code") + '' + data.mobile;
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
    	})

        // 国家选择 点击
    	$("#interCode").click(() => {
    		$("#countryPopup").removeClass("hidden");
    	})

        // 国家弹窗 - 点击
    	$("#countryList").on("click", ".country-list", function(){
    		lang = $(this).attr("data-lang");
    		interCode = $(this).attr("data-value")
    		setHtml();
    		$(this).addClass("on").siblings('.country-list').removeClass('on');
    		$("#nationalFlag").css({"background-image": "url('"+base.getImg($(this).attr("data-pic"))+"')"});
    		$("#interCode").text("+"+$(this).attr("data-value").substring(2)).attr("value", $(this).attr("data-value")).attr("code", $(this).attr("data-code"));
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
                    $('#formWrapperEmail').addClass('hidden');
                    $('#formWrapperMobile').removeClass('hidden');
                } else if (thisType === 'email') {
                    $('#formWrapperMobile').addClass('hidden');
                    $('#formWrapperEmail').removeClass('hidden');
                }
            }
        })
    }
});
