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

    function addListener(){

    }
});