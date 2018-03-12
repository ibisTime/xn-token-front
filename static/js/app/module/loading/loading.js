define([
    'jquery'
], function ($) {
    var tmpl = __inline("loading.html");
    var css = __inline("loading.css");

    $("head").append('<style>'+css+'</style>');
    function _hasLoading() {
        return !!$(".loading-module-wrap").length;
    }
    return {
        createLoading: function(msg){
            msg = msg || "加载中...";
            if(_hasLoading()){
                $(".loading-module-wrap")
                    .find(".loading-module-text").text(msg)
                    .end().show();
            }else{
                var cont = $(tmpl);
                cont.find(".loading-module-text").text(msg);
                $("body").append(cont);
            }
            return this;
        },
        showLoading: function(){
            if(_hasLoading()){
                $(".loading-module-wrap").show();
            }
            return this;
        },
        hideLoading: function(){
            $(".loading-module-wrap").hide();
            return this;
        }
    }
});