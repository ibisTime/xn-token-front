define([
    'app/controller/base',
    'app/util/ajax',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
], function(base, Ajax, GeneralCtr, UserCtr) {
	
	var iosUpdateUrl,androidUpdateUrl;
	var lang = $("body").attr("data-lang") || 'ZH_CN';
	var firstLoad = true;
	var langValue = '';
	
    init();
    
    function init() {
    	
		setHtml();
		
		addListener();
    }
    
    // 设置页面html
    function setHtml(){
		base.showLoading()
    	$("title").html(base.getText('下载THA钱包',lang));
    	$(".upload-text .txt1").html(base.getText('Theia跨链生态钱包',lang));
    	$(".upload-text .txt2").html(base.getText('一站式数字应用管理平台',lang));
    	$(".upload-android").html(base.getText('安卓下载',lang));
    	$(".upload-ios").html(base.getText('iOS下载',lang));
		$.when(
			getListCountry(),
			getAndroidUrl(),
			getIosUrl()
		).then(function(){
			base.hideLoading()
			$("#upload_android").off('click').click(function(){
				if(base.getUserBrowser()=="android"){
					if(androidUpdateUrl!=""&&androidUpdateUrl){
						if(base.is_weixn()){
							$(".upload-mask").removeClass("hidden")
						}else{
							window.location.href = androidUpdateUrl;
//							base.confirm('<div class="confirm-loading">'+base.getText("下载中",lang)+'<div class="global-loading-icon1"></div></div>').then(function(){},function(){})
						}
					}else{
						base.confirm(base.getText("当前版本尚未上线，敬请期待！",lang),base.getText("取消",lang),base.getText("确定",lang)).then(function(){},function(){})
					}
				}else{
					base.confirm(base.getText("请点击下载iOS版！",lang),base.getText("取消",lang),base.getText("确定",lang)).then(function(){},function(){})
				}
			})
			$("#upload_ios").off('click').click(function(){
				if(base.getUserBrowser()=="ios"){
					if(iosUpdateUrl!=""&&iosUpdateUrl){
						if(base.is_mqqbrowser()){
							$(".upload-mask").removeClass("hidden")
						}else if(!$(this).hasClass("on")){
							$(this).addClass("on");
							window.location.href = iosUpdateUrl;
						}
//							base.confirm('<div class="confirm-loading">'+base.getText("下载中",lang)+'<div class="global-loading-icon1"></div></div>').then(function(){},function(){})
					}else{
						base.confirm(base.getText("当前版本尚未上线，敬请期待！",lang),base.getText("取消",lang),base.getText("确定",lang)).then(function(){},function(){})
					}
				}else{
					base.confirm(base.getText("请点击下载Android版！",lang),base.getText("取消",lang),base.getText("确定",lang)).then(function(){},function(){})
				}
			})
			
		})
    }
	
	// 获取安卓下载地址
	function getAndroidUrl(){
		return GeneralCtr.getSysConfigType("android-c").then(function(data) {
    		androidUpdateUrl = data.downloadUrl;
	    }, function() {
	        base.showMsg(base.getText("获取下载地址失败",lang));
	    });
	}
	
	// 获取ios下载地址
	function getIosUrl(){
		return GeneralCtr.getSysConfigType("ios-c").then(function(data) {
    		iosUpdateUrl = data.downloadUrl;
	    }, function() {
	        base.showMsg(base.getText("获取下载地址失败",lang));
	    });
	}
	
	// 列表查询国家
    function getListCountry(){
    	var data = LANGUAGELIST;
		var countryPic = '';
		var html = ``;
		data.forEach(v => {
			var on = '';
			if(lang == v.key) {
				on = 'on';
				firstLoad = false;
				langValue = v.value;
			}
			html += `<div class="country-list ${on}" data-value="${v.value}" data-key="${v.key}">
						<samp>${v.value}</samp>
						<i class="icon"></i>
					</div>`;
		})
		$("#countryList").html(html);
		
		$("#language").text(langValue).attr("data-key", lang);
		base.hideLoading();
    }
    
    function addListener(){
    	$(".upload-mask").click(function(){
			$(".upload-mask").addClass("hidden")
		})
    	
    	$("#languagePopup .close").click(function() {
    		$("#languagePopup").addClass("hidden");
    	})
    	
    	$("#language-wrap").click(() => {
    		$("#languagePopup").removeClass("hidden");
    	})
    	
		$("#countryList").on("click", ".country-list", function(){
    		lang = $(this).attr("data-key");
    		if(lang == $("#language").attr("data-key")){
    			$("#languagePopup").addClass("hidden");
    			return;
    		}
    		base.showLoading();
    		if(lang == 'ZH_CN'){
    			window.location.href = '../public/download.html';
    		} else {
    			window.location.href = '../public/download-'+ lang +'.html';
    		}
    		base.hideLoading();
    	})
    }
});