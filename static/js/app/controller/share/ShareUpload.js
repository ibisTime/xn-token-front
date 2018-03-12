define([
    'app/controller/base',
    'app/util/ajax',
], function(base, Ajax) {
	
	var iosUpdateUrl,androidUpdateUrl;
	
    init();
    
    function init() {
    	
		base.showLoading("加载中...")
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
						base.confirm("当前android版尚未上线，敬请期待！","确定").then(function(){},function(){})
					}
				}else{
					base.confirm("当前为iPhone系统请点击下载iPhone版！","确定").then(function(){},function(){})
				}
			})
			$("#upload_ios").click(function(){
				if(base.getUserBrowser()=="ios"){
					if(iosUpdateUrl!=""&&iosUpdateUrl){
						
						window.location.href = iosUpdateUrl;
					}else{
						base.confirm("当前iPhone版尚未上线，敬请期待！","确定").then(function(){},function(){})
					}
				}else{
					base.confirm("当前为android系统请点击下载android版！","确定").then(function(){},function(){})
				}
			})
			
		})
		
		$(".upload-mask").click(function(){
			$(".upload-mask").addClass("hidden")
		})
    }
	
	function getAndroidUrl(){
		return Ajax.get("660918",{
			"type":"android-c",
			"systemCode":SYSTEM_CODE,
			"companyCode":SYSTEM_CODE
		}).then(function(res) {
	        if (res.success) {
        		androidUpdateUrl = res.data.downloadUrl;
	        } else {
	        	base.showMsg(res.msg);
	        }
	    }, function() {
	        base.showMsg("获取安卓下载地址失败");
	    });
	}
	
	function getIosUrl(){
		return Ajax.get("660918",{
			"type":"ios-c",
			"systemCode":SYSTEM_CODE,
			"companyCode":SYSTEM_CODE
		}).then(function(res) {
	        if (res.success) {
        		iosUpdateUrl = res.data.downloadUrl;
	        } else {
	        	base.showMsg(res.msg);
	        }
	    }, function() {
	        base.showMsg("获取ios下载地址失败");
	    });
	}
});