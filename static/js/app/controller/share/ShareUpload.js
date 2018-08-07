define([
    'app/controller/base',
    'app/util/ajax',
    'app/interface/GeneralCtr',
], function(base, Ajax, GeneralCtr) {
	
	var iosUpdateUrl,androidUpdateUrl;
	
    init();
    
    function init() {
    	
    	
    	$("title").html(base.getText('下载THA钱包'));
    	$(".upload-text .txt1").html(base.getText('Theia跨链生态钱包'));
    	$(".upload-text .txt2").html(base.getText('一站式数字应用管理平台'));
    	$(".upload-android").html(base.getText('安卓下载'));
    	$(".upload-ios").html(base.getText('IOS下载'));
		base.showLoading()
		$.when(
			getAndroidUrl(),
			getIosUrl()
		).then(function(){
			base.hideLoading()
			$("#upload_android").click(function(){
				if(base.getUserBrowser()=="android"){
					if(androidUpdateUrl!=""&&androidUpdateUrl){
						if(base.is_weixn()){
							$(".upload-mask").removeClass("hidden")
						}else{
							window.location.href = androidUpdateUrl;
						}
					}else{
						base.confirm(base.getText("当前版本尚未上线，敬请期待！"),base.getText('确定')).then(function(){},function(){})
					}
				}else{
					base.confirm(base.getText("当前为iPhone系统请点击下载iPhone版！"),base.getText('确定')).then(function(){},function(){})
				}
			})
			$("#upload_ios").click(function(){
				if(base.getUserBrowser()=="ios"){
					if(iosUpdateUrl!=""&&iosUpdateUrl){
						
						window.location.href = iosUpdateUrl;
					}else{
						base.confirm(base.getText("当前版本尚未上线，敬请期待！"),base.getText('确定')).then(function(){},function(){})
					}
				}else{
					base.confirm(base.getText("当前为android系统请点击下载android版！"),base.getText('确定')).then(function(){},function(){})
				}
			})
			
		})
		
		$(".upload-mask").click(function(){
			$(".upload-mask").addClass("hidden")
		})
    }
	
	function getAndroidUrl(){
		return GeneralCtr.getSysConfigType("android-c").then(function(data) {
    		androidUpdateUrl = data.downloadUrl;
	    }, function() {
	        base.showMsg(base.getText("获取下载地址失败"));
	    });
	}
	
	function getIosUrl(){
		return GeneralCtr.getSysConfigType("ios-c").then(function(data) {
    		iosUpdateUrl = data.downloadUrl;
	    }, function() {
	        base.showMsg(base.getText("获取下载地址失败"));
	    });
	}
});