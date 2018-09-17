define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
    	//获取七牛Token
    	getQiniuToken() {
    		return Ajax.get("805951",{}, true, true);
    	},
        // 发送短信
        sendCaptcha(bizType, mobile, interCode, sendCode) {
    		var param={
        		bizType,
        		sendCode,
        		interCode
        	}
        	if(sendCode=="805952"){
        		param.email=mobile
        	}else{
        		param.mobile=mobile
        	}
            return Ajax.post(sendCode, param, true, true);
        },
        // 查询系统参数 type
        getSysConfigType(type) {
            return Ajax.get("660918", {type}, true, true);
        },
        // 查询系统参数 key
        getSysConfigKey(ckey) {
            return Ajax.get("660917", {ckey}, true, true);
    	},
        // 查询数据字典 parentKey
        getDictList(parentKey) {
            return Ajax.get("660906", {parentKey}, true, true);
    	}
    };
})

