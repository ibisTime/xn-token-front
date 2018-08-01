 define([
    'jValidate'
], function(V) {
    jQuery.extend(jQuery.validator.messages, {
        required: LANGUAGE['不能为空'][NOWLANG],
        remote: "请修正该字段",
        email: "请输入正确格式的电子邮件",
        url: "请输入合法的网址",
        date: "请输入合法的日期",
        dateISO: "请输入合法的日期 (ISO).",
        number: LANGUAGE['请输入合法的数字'][NOWLANG],
        digits: "只能输入整数",
        creditcard: "请输入合法的信用卡号",
        equalTo: "两次密码不同",
        accept: "请输入拥有合法后缀名的字符串",
        maxlength: jQuery.validator.format("长度不能超过 {0} 位"),
        minlength: jQuery.validator.format("长度不能少于 {0} 位"),
        rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
        range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
        max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
        min: jQuery.validator.format("请输入一个最小为 {0} 的值")
    });

    $.validator.setDefaults({
        errorPlacement: function(error, element) {
            error.insertAfter(element);
        }
    });

    $.validator.addMethod("bankCard", function(value, element) {
        var reg = /^(\d{16}|\d{19})$/;
        return this.optional(element) || reg.test(value);
    }, "格式错误");

    $.validator.addMethod("isIdCardNo", function(value, element) {
        return this.optional(element) || isIdCardNo(value);
    }, "身份证格式错误");

    $.validator.addMethod("isNotFace", function(value, element) {
        return this.optional(element) || /^[\s0-9a-zA-Z\u4e00-\u9fa5\u00d7\u300a\u2014\u2018\u2019\u201c\u201d\u2026\u3001\u3002\u300b\u300e\u300f\u3010\u3011\uff01\uff08\uff09\uff0c\uff1a\uff1b\uff1f\uff0d\uff03\uffe5\x21-\x7e]+$/.test(value);
    }, "请输入合法字符");
    $.validator.addMethod("chinese", function(value, element) {
        return this.optional(element) || /^[\u4e00-\u9fa5]+$/.test(value);
    }, "只能输入中文");
    //验证当前值和目标val的值相等 相等返回为 false
    jQuery.validator.addMethod("equalTo2", function(value, element) {
        var returnVal = true;
        var id = $(element).attr("data-rule-equalto2");
        var targetVal = $(id).val();
        if (value === targetVal) {
            returnVal = false;
        }
        return returnVal;
    }, "不能和原始密码相同");

    //大于指定数
    jQuery.validator.addMethod("gt", function(value, element) {
        var returnVal = false;
        var gt = $(element).data("gt");
        if (+value > +gt && value != "") {
            returnVal = true;
        }
        return returnVal;
    }, "不能小于0 或空");
    $.validator.addMethod("isPositive", function(value, element) {
        var aint = parseFloat(value);
        return this.optional(element) || aint > 0;
    }, '请输入大于0的数字');

    $.validator.addMethod("Z+", function(value, element) {
        return this.optional(element) || /^[1-9]\d*$/.test(value);
    }, '请输入正整数');
    //邮箱
    jQuery.validator.addMethod("mail", function(value, element) {
        var mail = /^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$/;
        return this.optional(element) || (mail.test(value));
    }, "邮箱格式错误");

    //电话验证规则
    jQuery.validator.addMethod("phone", function(value, element) {
        var phone = /^0\d{2,3}-\d{7,8}$/;
        return this.optional(element) || (phone.test(value));
    }, "电话格式如：0371-68787027");

    //区号验证规则
    jQuery.validator.addMethod("ac", function(value, element) {
        var ac = /^0\d{2,3}$/;
        return this.optional(element) || (ac.test(value));
    }, "区号如：010或0371");

    //无区号电话验证规则
    jQuery.validator.addMethod("noactel", function(value, element) {
        var noactel = /^\d{7,8}$/;
        return this.optional(element) || (noactel.test(value));
    }, "电话格式如：68787027");

    //手机验证规则
    jQuery.validator.addMethod("mobile", function(value, element) {
        var mobile = /^1[3|4|5|7|8|9]\d{9}$/;
        return this.optional(element) || (mobile.test(value));
    }, "手机格式错误");

    //邮箱或手机验证规则
    jQuery.validator.addMethod("mm", function(value, element) {
        var mm = /^[a-z0-9._%-]+@([a-z0-9-]+\.)+[a-z]{2,4}$|^1[3|4|5|7|8]\d{9}$/;
        return this.optional(element) || (mm.test(value));
    }, "邮箱或手机格式错误");

    //电话或手机验证规则
    jQuery.validator.addMethod("tm", function(value, element) {
        var tm = /(^1[3|4|5|7|8]\d{9}$)|(^\d{3,4}-\d{7,8}$)|(^\d{7,8}$)|(^\d{3,4}-\d{7,8}-\d{1,4}$)|(^\d{7,8}-\d{1,4}$)/;
        return this.optional(element) || (tm.test(value));
    }, "电话或手机格式错误");
    //短信验证码规则
    jQuery.validator.addMethod("sms", function(value, element) {
        var tm = /^[0-9]\d*$/;
        return this.optional(element) || (tm.test(value));
    }, "验证码格式错误");
    //身份证号码的验证规则
    function isIdCardNo(num) {
        var len = num.length,
            re;
        if (len == 15)
            re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
        else if (len == 18)
            re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
        else {
            return false;
        }
        var a = num.match(re);
        if (a != null) {
            if (len == 15) {
                var D = new Date("19" + a[3] + "/" + a[4] + "/" + a[5]);
                var B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
            } else {
                var D = new Date(a[3] + "/" + a[4] + "/" + a[5]);
                var B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
            }
            if (!B) {
                return false;
            }
        }
        if (!re.test(num)) {
            return false;
        }
        return true;
    }
    $.validator.addMethod("amount", function(value, element) {
        return /^\d+(\.\d{1,2})?$/.test(value);
    }, '金额最多有两位小数');
});
