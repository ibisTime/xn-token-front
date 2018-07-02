define([
    'jquery'
], function ($) {
    return {
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
                    img.closest(".default-bg").removeClass("default-bg");
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
                        img.closest(".default-bg").removeClass("default-bg");
                    });
                })(img);

            }
            return wrap;
        }
    };
});
