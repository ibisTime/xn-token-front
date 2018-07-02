var SYSTEM_CODE = "CD-TOKEN00018";
//七牛地址
var PIC_PREFIX = 'http://pajvine9a.bkt.clouddn.com/';
var PIC_SHOW = '?imageMogr2/auto-orient/interlace/1';

// 当前语言
var NOWLANG = getUrlParam('lang') || 'cn';

function getUrlParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
	    return decodeURIComponent(r[2]);
	return '';
}

