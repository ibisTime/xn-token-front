define([
    "jquery",
    'app/util/cookie',
    'app/util/dialog',
    'app/module/loading'
], function($, CookieUtil, dialog, loading) {
    var cache = {};

    function getUrl(code) {
        return "/api";
    }

    function clearSessionUser() {
        sessionStorage.removeItem("userId"); //userId
        sessionStorage.removeItem("token"); //token
    }
    // 根据语言获取文本
	function getText(text, defaultTXT){
		var t =  ERRORINFO[text] && ERRORINFO[text][lang] ? ERRORINFO[text][lang] : '';
		if(!ERRORINFO[text] || t == '') {
			if(!ERRORINFO[text]){
				t = defaultTXT;
				console.log('[' + text +']没有翻译配置');
			} else {
				if(!ERRORINFO[text]['EN']){
					t = defaultTXT
				}else{
					t = defaultTXT;
				}
				console.log(lang + ': [' + text +']没有翻译配置');
			}
		}
		return t;
	}

    function showMsg(msg, time) {
        var d = dialog({
            content: msg,
            quickClose: true
        });
        d.show();
        setTimeout(function() {
            d.close().remove();
        }, time || 1500);
        return d;
    }
    return {
        get: function(code, json, reload, noToken) {
            if (typeof json == "undefined" || typeof json == "boolean") {
                reload = json;
                json = {};
            }
            return this.post(code, json, !!reload, noToken);
        },
        post: function(code, json, reload, noToken) {
            reload = typeof reload == "undefined" ? true : reload;
            noToken = typeof noToken == "undefined" ? false : reload;

            var token = sessionStorage.getItem("token") || "";

            if(!noToken){
            	token && (json["token"] = token);
            }
            json["systemCode"] = SYSTEM_CODE;
            json["companyCode"] = SYSTEM_CODE;
            json["client"] = CLIENT;

            var sendUrl = getUrl(code);
            var sendParam = {
                code: code,
                json: json
            };
            var cache_url = sendUrl + JSON.stringify(sendParam);
            if (reload) {
                delete cache[code];
            }
            cache[code] = cache[code] || {};
            if (!cache[code][cache_url]) {
                sendParam.json = JSON.stringify(json);
                cache[code][cache_url] = $.ajax({
                    type: 'post',
                    url: sendUrl,
                    data: sendParam
                });
            }
            return cache[code][cache_url].pipe(function(res) {
            	
//              if (res.errorCode == "4") {
//                  clearSessionUser();
//                  sessionStorage.setItem("l-return", location.pathname + location.search);
//                  loading.hideLoading();
//                  setTimeout(function() {
//                      location.replace("../user/login.html");
//                  }, 800);
//                  return $.Deferred().reject("登录超时，请重新登录");
//              }
                if(res.errorInfo == "用户状态异常"){
    				location.replace("../user/isRock.html?isRock=1");
                }
//              if(res.errorBizCode == "xn100001"){
//                  clearSessionUser();
//                  sessionStorage.setItem("l-return", location.pathname + location.search);
//                  loading.hideLoading();
//                  setTimeout(function() {
//                      location.replace("../user/login.html");
//                  }, 800);
//                  return $.Deferred().reject("登录异常，请重新登录");
//              }
                if(res.errorCode != "0"){
                    loading.hideLoading();
                    return $.Deferred().reject(getText(res.errorBizCode, res.errorInfo));
                }
                return res.data;
            }).fail(function(error){
                error && showMsg(error);
            });
        }
    };
});
