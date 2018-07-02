define([
    'jquery',
    'app/util/dialog',
    'app/interface/GeneralCtr'
], function ($, dialog, GeneralCtr) {
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
    function initSms(opt){
        this.options = $.extend({}, this.defaultOptions, opt);
        var _self = this;
        $("#" + this.options.id).off("click")
            .on("click", function(e) {
                e.stopPropagation();
                e.preventDefault();
                _self.options.checkInfo() && _self.handleSendVerifiy();
            });
    }
    initSms.prototype.defaultOptions = {
        id: "getVerification",
        mobile: "mobile",
        interCode: "interCode",
        checkInfo: function () {
            return $("#" + this.interCode).valid() && $("#" + this.mobile).valid();
        },
        sendCode: '805950'
    };
    initSms.prototype.handleSendVerifiy = function() {
        var verification = $("#" + this.options.id);
        verification.prop("disabled", true);
        GeneralCtr.sendCaptcha(this.options.bizType, $("#" + this.options.mobile).val(), $("#" + this.options.interCode).val(), this.options.sendCode)
            .then(() => {
                var i = 60;
                this.timer = window.setInterval(() => {
                    if(i > 0){
                        verification.text(i-- + "s");
                    }else {
                        verification.text("获取验证码").prop("disabled", false);
                        clearInterval(this.timer);
                    }
                }, 1000);
            }, () => {
                this.options.errorFn && this.options.errorFn();
                verification.text("获取验证码").prop("disabled", false);
            });
    }
    return {
        init: function (options) {
            new initSms(options);
        }
    }
});
