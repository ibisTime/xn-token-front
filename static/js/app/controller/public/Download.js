define([
    'app/controller/base',
    'app/util/ajax',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
], function(base, Ajax, GeneralCtr, UserCtr) {
	
	var iosUpdateUrl,androidUpdateUrl;
	var lang = $("body").attr("data-lang") || 'ZH_CN';
	var channel = base.getUrlParam('channel') || 'theia';
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
    	$("title").html(base.getText('下载Theia钱包',lang));
    	$(".upload-text .txt1").html(base.getText('全球首款跨链生态钱包',lang));
    	$(".uploadBtn").html(base.getText('立即下载',lang));
    	$(".upload-remark").html(base.getText('若无法安装或任何原因需卸载原版本...',lang))
		$(".installTutorial-wrap .title .txt").html(base.getText('安装教程',lang))
		$(".section .first").html(base.getText('1.第一次打开Theia钱包的时候会弹出如下框。',lang))
		$(".section .img-wrap1").html(`<img src="/static/images/installFirst_${INSTALLIMG[lang]}.png"/>`);
		$(".section .second").html(base.getText('2.首次安装的用户,请前往...',lang))
		$(".section .img-wrap2").html(`<img src="/static/images/installSecond_${INSTALLIMG[lang]}.png"/>`);
		$(".section .third").html(base.getText('3.点击信任这个证书就可以...',lang))
		$(".section .img-wrap3").html(`<img src="/static/images/installThird_${INSTALLIMG[lang]}.png"/>`);
		$(".upload-mask p").html(base.getText('请点击右上角<br/>点击在浏览器打开下载APP',lang))
		
		$.when(
			getListCountry(),
			getAndroidUrl(),
			getIosUrl()
		).then(function(){
			base.hideLoading()
			$("#uploadBtn").off('click').click(function(){
				if(base.getUserBrowser()=="ios"){
					if(iosUpdateUrl!=""&&iosUpdateUrl){
						if(base.is_mqqbrowser()){
							$(".upload-mask").removeClass("hidden")
						}else if(!$(this).hasClass("on")){
							$(this).addClass("on");
							window.location.href = iosUpdateUrl;
						}
					}else{
						base.confirm(base.getText("当前版本尚未上线，敬请期待！",lang),base.getText("取消",lang),base.getText("确定",lang)).then(function(){},function(){})
					}
				}else{
					if(androidUpdateUrl!=""&&androidUpdateUrl){
						if(base.is_weixn()){
							$(".upload-mask").removeClass("hidden")
						}else{
							window.location.href = androidUpdateUrl;
						}
					}else{
						base.confirm(base.getText("当前版本尚未上线，敬请期待！",lang),base.getText("取消",lang),base.getText("确定",lang)).then(function(){},function(){})
					}
				}
			})
			
		})
    }
	
	// 获取安卓下载地址
	function getAndroidUrl(){
		return GeneralCtr.getSysConfigKey("h5_download_android").then(function(data) {
    		androidUpdateUrl = replaceChannelName(data.cvalue);
	    }, function() {
	        base.showMsg(base.getText("获取下载地址失败",lang));
	    });
	}
	
	// 获取ios下载地址
	function getIosUrl(){
		return GeneralCtr.getSysConfigKey("h5_download_ios").then(function(data) {
    		iosUpdateUrl = replaceChannelName(data.cvalue);
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
    
    function replaceChannelName(url){
    	var url1 = url.split('{')[0];
    	var url2 = url.split('}')[1];
    	var href = url1 + channel + url2;
    	
    	return href;
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
    			window.location.href = DOWNLOADLINK+'.html?channel='+channel;
    		} else {
    			window.location.href = DOWNLOADLINK+'-'+ lang +'.html?channel='+channel;
    		}
    		base.hideLoading();
    	})
    }
});