var SYSTEM_CODE = "CD-TOKEN00018";
var CLIENT = "WEB_H5";// h5登录标识
//七牛地址
var PIC_PREFIX = 'http://pajvine9a.bkt.clouddn.com/';
var PIC_SHOW = '?imageMogr2/auto-orient/interlace/1';

// 根据国家interCode 配置语言
var LANGUAGECODELIST={
	'0086': 'ZH_CN',
	'0062': 'EN',
	'0060': 'EN',
	'0082': 'KO',
}

// 当前语言
var NOWLANG = getUrlParam('lang') || 'ZH_CN';

// 获取链接入参
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
	    return decodeURIComponent(r[2]);
	return '';
}