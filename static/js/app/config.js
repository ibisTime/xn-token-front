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
	'00886': 'ZH_CN',
	'00853': 'ZH_CN',
	'00852': 'ZH_CN'
}

//当前语言设置列表
var LANGUAGELIST=[
	{
		'key':'ZH_CN',
		'value': '中文简体'
	},{
		'key':'EN',
		'value': 'English'
	},{
		'key':'KO',
		'value': '한국어'
	}
];

// 下载页安装教程图片语言配置
var INSTALLIMG={
	'ZH_CN': 'ZH_CN',
	'EN': 'EN',
	'KO': 'EN',
}


// 当前语言
var NOWLANG = getUrlParam('lang') || 'EN';

//下载页链接
var DOWNLOADLINK = '../share/share-upload';

// 获取链接入参
function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
	    return decodeURIComponent(r[2]);
	return '';
}