define([
    'jquery'
], function ($) {
    var tmpl = __inline("index.html");
    var css = __inline("index.css");

    $("head").append('<style>'+css+'</style>');
    function _hasLoading() {
        return !!$(".loading-module-wrap").length;
    }
    return {
        createLoading: function(msg, hasBottom){
            msg = msg || "Loading...";
            if(_hasLoading()){
                $(".loading-module-wrap")
                    .find(".loading-module-text").text(msg)
                    .end().show();
            }else{
                var cont = $(tmpl);
                cont.find(".loading-module-text").text(msg);
                $("body").append(cont);
            }
            if(hasBottom){
                $(".loading-module-wrap").addClass("loading-has-bottom");
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
