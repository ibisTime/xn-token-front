define([
    'jquery'
], function ($) {
    var tmpl = __inline("showImg.html");
    var css = __inline("showImg.css");

    $("head").append('<style>'+css+'</style>');
    function _hasShowImg() {
        return !!$(".module-show-img-mask").length;
    }
    return {
        createImg: function(pic){
        	pic = pic && pic.replace(/\?.*/gi, "") || "";
            if(_hasShowImg()){
                $("#J_ShowImg_Cont").attr("src", pic);
            }else{
                var cont = $(tmpl);
                cont.find("#J_ShowImg_Cont").attr("src", pic);
                $("body").append(cont);
                var that = this;
                $(".module-show-img-mask").on("click", function(){
                	that.hideImg();
                });
            }
            return this;
        },
        showImg: function(time){
            if(_hasShowImg()){
                $(".module-show-img-mask").fadeIn(time || 200);
            }
            return this;
        },
        hideImg: function(time){
        	if(_hasShowImg()){
        		$(".module-show-img-mask").fadeOut(time || 200);
        	}
            return this;
        }
    }
});