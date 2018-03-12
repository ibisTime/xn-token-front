define([
    'jquery',
    'app/util/ajax',
    'app/util/dialog',
    'app/module/loading/loading'
], function($, Ajax, dialog, loading) {

    if (Number.prototype.toFixed) {
        var ori_toFixed = Number.prototype.toFixed;
        Number.prototype.toFixed = function() {
            var num = ori_toFixed.apply(this, arguments);
            if (num == 0 && num.indexOf('-') == 0) { // -0 and 0
                num = num.slice(1);
            }
            return num;
        }
    }

    String.prototype.temp = function(obj) {
        return this.replace(/\$\w+\$/gi, function(matchs) {
            var returns = obj[matchs.replace(/\$/g, "")];
            return (returns + "") == "undefined" ? "" : returns;
        });
    };

    Date.prototype.format = function(format) {
        var o = {
            "M+": this.getMonth() + 1, //month
            "d+": this.getDate(), //day
            "h+": this.getHours(), //hour
            "m+": this.getMinutes(), //minute
            "s+": this.getSeconds(), //second
            "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
            "S": this.getMilliseconds() //millisecond
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return format;
    };

    $.prototype.serializeObject = function() {
        var a, o, h, i, e;
        a = this.serializeArray();
        o = {};
        h = o.hasOwnProperty;
        for (i = 0; i < a.length; i++) {
            e = a[i];
            if (!h.call(o, e.name)) {
                o[e.name] = e.value;
            }
        }
        return o;
    };

    var Base = {
        encodeInfo: function(info, headCount, tailCount, space) {
            headCount = headCount || 0;
            tailCount = tailCount || 0;
            info = info.trim();
            var header = info.slice(0, headCount),
                len = info.length,
                tailer = info.slice(len - tailCount),
                mask = '**************************************************', // allow this length
                maskLen = len - headCount - tailCount;
            if (space) {
                mask = '**** **** **** **** **** **** **** **** **** **** **** ****';
            }
            return maskLen > 0 ? (header + mask.substring(0, maskLen + (space ? maskLen / 4 : 0)) + (space ? ' ' : '') + tailer) : info;
        },
        formatDate: function(date, format) {
            return date ? new Date(date).format(format) : "--";
        },
        getImg: function(pic) {
            return pic ? (PIC_PREFIX + pic + THUMBNAIL_SUFFIX) : "";
        },
        getUrlParam: function(name, locat) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
            var r = (locat || window.location.search).substr(1).match(reg);
            if (r != null) return decodeURIComponent(r[2]);
            return '';
        },
        findObj: function(array, key, value, key2, value2) {
            var i = 0,
                len = array.length,
                res;
            for (i; i < len; i++) {
                if (array[i][key] == value && !key2) {
                    return array[i];
                } else if (key2 && array[i][key] == value && array[i][key2] == value2) {
                    return array[i];
                }
            }
        },
        formatMoney: function(s, t) {
            return $.isNumeric(s) ? (+s / 1000).toFixed(t || 2) : "--";
        },
        fZeroMoney: function(s) {
            if (!$.isNumeric(s))
                return 0;
            s = +s / 1000;
            return s.toFixed(0);
        },
        getDictList: function(type,code) {
            return Ajax.get(code, {
                parentKey: type
            });
        },
        calculateSecurityLevel: function(password) {
            var strength_L = 0;
            var strength_M = 0;
            var strength_H = 0;

            for (var i = 0; i < password.length; i++) {
                var code = password.charCodeAt(i);
                // 数字
                if (code >= 48 && code <= 57) {
                    strength_L++;
                    // 小写字母 大写字母
                } else if ((code >= 65 && code <= 90) ||
                    (code >= 97 && code <= 122)) {
                    strength_M++;
                    // 特殊符号
                } else if ((code >= 32 && code <= 47) ||
                    (code >= 58 && code <= 64) ||
                    (code >= 94 && code <= 96) ||
                    (code >= 123 && code <= 126)) {
                    strength_H++;
                }
            }
            // 弱
            if ((strength_L == 0 && strength_M == 0) ||
                (strength_L == 0 && strength_H == 0) ||
                (strength_M == 0 && strength_H == 0)) {
                return "1";
            }
            // 强
            if (0 != strength_L && 0 != strength_M && 0 != strength_H) {
                return "3";
            }
            // 中
            return "2";
        },
        calculateDays: function(start, end) {
            if (!start || !end)
                return 0;
            start = new Date(start);
            end = new Date(end);
            return (end - start) / (3600 * 24 * 1000);
        },
        isAddrEqual: function(name1, name2) {
            return name1 == name2 || name2.indexOf(name1) != -1 || name1.indexOf(name2) != -1 || false
        },
        getPic: function(pic, suffix) {
            return PIC_PREFIX + pic + (suffix || "");
        },
        //获取全国所有城市信息
    	getRealLocation:function (initFun, province, city, area, longitude, latitude, errFun) {
	        Base.getAddress()
	            .then(function(data) {
	                citylist = data.citylist;
	                var html = "",
	                    k = 0;
	                //遍历省
	                $.each(citylist, function(i, prov) {
	                    if(Base.isAddrEqual(prov.p, province)){
	                        province = prov.p;
	                        $.each(prov.c, function(j, c) {
	                            //如果是当前定位的位置，则显示并保存到session中
	                            if (Base.isAddrEqual(c.n, city)) {
	                                city = c.n;
	                                if(c.a && c.a[0].s && area){
	                                    $.each(c.a, function (k, a) {
	                                        if(Base.isAddrEqual(a.s, area)){
	                                            area = a.s;
	                                        }
	                                    });
	                                }
	                            }
	                        });
	                    }
	                });
	                loading.hideLoading();
	                if(!province){
	                    Base.showMsg("定位失败");
	                    errFun && errFun();
	                }else{
	                    sessionStorage.setItem("dw-province", province);
	                    sessionStorage.setItem("dw-city", city);
	                    sessionStorage.setItem("dw-area", area);
	                    sessionStorage.setItem("dw-longitude", longitude);
	                    sessionStorage.setItem("dw-latitude", latitude);
	                    //直辖市
	                    if(area == ""){
	                        area = city;
	//                      city = province;
	                    }
//	                    area = "";
	                    sessionStorage.setItem("province", province);
	                    sessionStorage.setItem("city", city);
	                    sessionStorage.setItem("area", area);
	                    sessionStorage.setItem("longitude", longitude);
	                    sessionStorage.setItem("latitude", latitude);
	
	                    initFun(citylist);
	                }
	            });
	    },
	    getInitLocation: function (initFun, errFun){
	    	var province = sessionStorage.getItem("province") || "",
                city = sessionStorage.getItem("city") || "",
                area = sessionStorage.getItem("area") || "",
                longitude = sessionStorage.getItem("longitude", longitude),
                latitude = sessionStorage.getItem("latitude", latitude);
                loading.createLoading("定位中...");
                
                if(!province){
                	//加载地图，调用浏览器定位服务
			        map = new AMap.Map('', {
			            resizeEnable: true
			        });
			        map.plugin('AMap.Geolocation', function() {
			            geolocation = new AMap.Geolocation({
			                enableHighAccuracy: true,//是否使用高精度定位，默认:true
			                timeout: 4000,          //超过5秒后停止定位，默认：无穷大
			            });
			            map.addControl(geolocation);
			            geolocation.getCurrentPosition();
			            AMap.event.addListener(geolocation, 'complete', function(data) {
			                var lng = data.position.getLng(),
			                    lat = data.position.getLat(),
			                    addressComponent = data.addressComponent,
			                    province = addressComponent.province,
			                    city = addressComponent.city,
			                    area = addressComponent.district;
			                
			                if(province && city && area){
				                sessionStorage.setItem("province",province),
				                sessionStorage.setItem("city",city),
				                sessionStorage.setItem("area",area),
				                sessionStorage.setItem("longitude", lng),
				                sessionStorage.setItem("latitude", lat);
				                loading.hideLoading();
				                initFun();	
			                }else{
			                	loading.hideLoading();
			                	errFun();
			                }
			               
			            });
			            AMap.event.addListener(geolocation, 'error', function(data) {
			            	loading.hideLoading();
			                errFun();
			            });      //返回定位出错信息
			        });
                }else{
                	loading.hideLoading();
                    initFun();
                }
	    },
        //获取地址json
        getAddress: function() {
            var addr = localStorage.getItem("addr");
            if (addr) {
                var defer = jQuery.Deferred();
                addr = $.parseJSON(addr);
                if (!addr.citylist) {
                    addr = $.parseJSON(addr);
                }
                defer.resolve(addr);
                return defer.promise();
            } else {
                return Ajax.get1("/static/js/lib/city.min.json")
                    .then(function(res) {
                        if (res.citylist) {
                            localStorage.setItem("addr", JSON.stringify(res));
                            return res;
                        }
                        localStorage.setItem("addr", JSON.stringify(res));
                        return $.parseJSON(res);
                    });
            }
        },
        getDomain: function() {
            return location.origin;
        },
        isNotFace: function(value) {
            var pattern = /^[\s0-9a-zA-Z\u4e00-\u9fa5\u00d7\u300a\u2014\u2018\u2019\u201c\u201d\u2026\u3001\u3002\u300b\u300e\u300f\u3010\u3011\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff0d\uff03\uffe5\x21-\x7e]*$/;
            return pattern.test(value)
        },
        showMsg: function(msg, time) {
            var d = dialog({
                content: msg,
                quickClose: true
            });
            d.show();
            setTimeout(function() {
                d.close().remove();
            }, time || 1500);
        },
        makeReturnUrl: function(param) {
            var url = location.pathname + location.search;
            if (param) {
                var str = "";
                for (var n in param) {
                    str += "&" + n + "=" + param[n];
                }
                if (/\?/i.test(url)) {
                    url = url + str;
                } else {
                    url = url + "?" + str.substr(1, str.length);
                }
            }
            return encodeURIComponent(url);
        },
        getReturnParam: function() {
            var re = Base.getUrlParam("return");
            if (re) {
                return encodeURIComponent(re);
            }
            return "";
        },
        goBackUrl: function(url) {
            var rUrl = Base.getUrlParam("return");
            if (rUrl) {
                location.href = rUrl;
            } else {
                location.href = url || "../index.html";
            }
        },
        addIcon: function() {
            var icon = sessionStorage.getItem("icon");
            if (icon && icon != "undefined") {
                $("head").append('<link rel="shortcut icon" type="image/ico" href="' + icon + '">');
            }
        },
        isLogin: function() {
            return !!sessionStorage.getItem("user");
        },
        getUser: function(refresh) {
            return Ajax.get("805043", {}, !refresh)
                .then(function(res) {
                    if (res.success) {
                        Base.setSessionUserInfo(res.data);
                    }
                    return res;
                }, function(res) {
                    return res;
                });
        },
        getUserId: function() {
            return sessionStorage.getItem("user") || "";
        },
        setSessionUser: function(res) {
            sessionStorage.setItem("user", res.data.userId);
            sessionStorage.setItem("tk", res.data.token);
        },
        //清除sessionStorage中和用户相关的数据
        clearSessionUser: function() {
            sessionStorage.removeItem("user"); //userId
            sessionStorage.removeItem("tk"); //token
        },
        //登出
        logout: function() {
            Base.clearSessionUser();
        },
        confirm: function(msg,okValue) {
            return (new Promise(function (resolve, reject) {
                var d = dialog({
                	title:'提示',
                    content: msg,
                    ok: function () {
                        var that = this;
                        setTimeout(function () {
                            that.close().remove();
                        }, 1000);
                        resolve();
                        return true;
                    },
                    cancel: function () {
                        reject();
                        return true;
                    },
                    cancelValue: '取消',
                    okValue: okValue||'去下载App'
                });
                d.showModal();
            }));

        },
        //判断终端
        getUserBrowser:function(){
        	var browser = {
                versions: function() {
                    var u = navigator.userAgent, app = navigator.appVersion;
                    return {//移动终端浏览器版本信息
                        trident: u.indexOf('Trident') > -1, //IE内核
                        presto: u.indexOf('Presto') > -1, //opera内核
                        webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
                        gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
                        mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
                        ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
                        iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQHD浏览器
                        iPad: u.indexOf('iPad') > -1, //是否iPad
                        webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            }
 
            if (browser.versions.ios || browser.versions.iPhone || browser.versions.iPad) {//ios
            	return 'ios';
            }else{//android
            	return 'android';
            }
        },
        loadImg: function (html) {
            var wrap = $(html);
            var imgs = wrap.find("img");
            for (var i = 0; i < imgs.length; i++) {
                var img = imgs.eq(i);
                if (img[0].complete) {
                    var width = img[0].width,
                        height = img[0].height;
                    if (width > height) {
                        img.addClass("hp100");
                    } else {
                        img.addClass("wp100");
                    }
                    // img.closest(".default-bg").removeClass("default-bg");
                    continue;
                }
                (function(img) {
                    img[0].onload = (function() {
                        var width = this.width,
                            height = this.height;
                        if (width > height) {
                            img.addClass("hp100");
                        } else {
                            img.addClass("wp100");
                        }
                        // img.closest(".default-bg").removeClass("default-bg");
                    });
                })(img);

            }
            return wrap;
        },
        // 显示loading
        showLoading: function(msg, hasBottom) {
            loading.createLoading(msg, hasBottom);
        },
        // 隐藏loading
        hideLoading: function() {
            loading.hideLoading();
        },
		is_weixn:function (){ 
			var ua = navigator.userAgent.toLowerCase(); 
			if(ua.match(/MicroMessenger/i)=="micromessenger") { 
				return true; 
			} else { 
				return false; 
			} 
		}
	
    };
	
    return Base;
});