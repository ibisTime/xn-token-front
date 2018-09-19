define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
    	// 获取红包详情
    	getRedPacketDetail(config){
    		return Ajax.get("623006", config);
    	},
    	// 领取红包
    	receiveRedPacket(redPacketCode){
    		return Ajax.get("623001", {
    			redPacketCode,
    			userId: base.getUserId()
    		});
    	},
    	// 列表查询国家
    	getListCountry(){
    		return Ajax.get("801120", {status: 1}, true, true);
    	},
    	// 短信验证码登录
    	login(config) {
    		return Ajax.get("805044", config, true, true);
    	},
    	// 获取用户信息
    	getUserInfo(userId){
    		return Ajax.get("805121", {
    			userId
    		}, true);
    	},
    };
})
