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
    	}
    };
})
