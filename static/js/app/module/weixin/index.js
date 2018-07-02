define([
    'jweixin',
    'app/module/loading',
    'app/interface/GeneralCtr'
], function (wx, loading, GeneralCtr) {
    var globalConfig = {};
    /*
     * 初始化微信分享
     * data: {appId, timestamp, nonceStr, signature}
     * config: {
     *   title,  分享标题
     *   desc,   分享描述
     *   link,   分享链接
     *   imgUrl  分享图标
     * }
     */
    function _initShare(data, config) {
        wx.config({
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
                "onMenuShareTimeline",
                "onMenuShareAppMessage",
                "onMenuShareQQ",
                "onMenuShareQZone"
            ]
        });
        let me = this;
        wx.ready(() => {
            // 分享给某人
            wx.onMenuShareAppMessage(config);
            // 朋友圈分享
            wx.onMenuShareTimeline(config);
            // qq分享
            wx.onMenuShareQQ(config);
            // qq空间分享
            wx.onMenuShareQZone(config);
        });
        wx.error((error) => {});
    }
    // 微信支付
    function _onBridgeReady() {
        var initPayConfig = globalConfig["initPay"],
            wxConfig = initPayConfig.wxConfig,
            success = initPayConfig.success,
            error = initPayConfig.error;
        WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
                "appId": wxConfig.appId, //公众号名称，由商户传入
                "timeStamp": wxConfig.timeStamp, //时间戳，自1970年以来的秒数
                "nonceStr": wxConfig.nonceStr, //随机串
                "package": wxConfig.wechatPackage,
                "signType": wxConfig.signType, //微信签名方式：
                "paySign": wxConfig.paySign //微信签名
            },
            function(res) {
                loading.hideLoading();
                // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    success && success();
                } else if(res.err_msg == "get_brand_wcpay_request:fail"){
                    error && error();
                }
            }
        );
    }
    /*
     * 初始化微信扫一扫
     * success: func, error: func
     */
    function _initScanQRCode(data, success, error) {
        wx.config({
            appId: data.appId, // 必填，公众号的唯一标识
            timestamp: data.timestamp, // 必填，生成签名的时间戳
            nonceStr: data.nonceStr, // 必填，生成签名的随机串
            signature: data.signature, // 必填，签名，见附录1
            jsApiList: ["scanQRCode"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        });
        wx.ready(function() {
            loading.hideLoading();
            wx.scanQRCode({
                needResult: 1,
            	success: success,
                fail: error
            });
        });
        wx.error(function(error) {
            loading.hideLoading();
            alert("微信sdk初始化失败");
        })
    }

    return {
        /*
         * 初始化微信分享
         * config: {
         *   title, 分享标题
         *   desc,  分享描述
         *   link,  分享链接
         *   imgUrl 分享图标
         * }
         */
        initShare: (config) => {
            GeneralCtr.getInitWXSDKConfig()
                .then((data) => {
                    _initShare(data, config);
                }, (error) => {
                    alert(JSON.stringify(error));
                });
        },
        /*
         * 初始化微信支付
         * wxConfig: object, success: func, error: func
         */
        initPay: (wxConfig, success, error) => {
            globalConfig["initPay"] = {
                wxConfig,
                success,
                error
            };
            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.removeEventListener("WeixinJSBridgeReady", _onBridgeReady);
                    document.addEventListener('WeixinJSBridgeReady', _onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.detachEvent('WeixinJSBridgeReady', _onBridgeReady);
                    document.detachEvent('onWeixinJSBridgeReady', _onBridgeReady);
                    document.attachEvent('WeixinJSBridgeReady', _onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', _onBridgeReady);
                }
            } else {
                _onBridgeReady();
            }
        },
        /*
         * 初始化微信扫一扫
         * success: func, error: func
         */
        initScanQRCode: (success, error) => {
            GeneralCtr.getInitWXSDKConfig()
                .then((data) => {
                    _initScanQRCode(data, success, error);
                }, (error) => {
                    alert("微信sdk初始化失败");
                });
        }
    }
});
