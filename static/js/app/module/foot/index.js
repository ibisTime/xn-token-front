define([
    'jquery'
], function ($) {
    var tmpl = __inline("index.html");
    var activeImgs = [
        __uri('../../../../images/home_on.png'),
        __uri('../../../../images/mall_on.png'),
        __uri('../../../../images/lease_on.png'),
        __uri('../../../../images/user_on.png')
    ];

    return {
        addFoot: function (idx) {
            var temp = $(tmpl);
            idx == undefined ? temp.appendTo($("body")) :
                temp.find("a:eq(" + idx + ")")
                    .addClass("active")
                    .find("img").attr("src", activeImgs[idx])
                    .end().end()
                    .appendTo($("body"));
        }
    }
});
