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
      // 短信注册
      mobileRegister(config) {
        return Ajax.get("805045", config, true, true);
      },
      // 邮箱注册
      emailRegister(config) {
        return Ajax.get("805046", config, true, true);
      },
    	// 登录
    	login(config) {
    		return Ajax.get("805051", config, true, true);
    	},
    	// 获取用户信息
    	getUserInfo(userId){
    		return Ajax.get("805121", {
    			userId
    		}, true);
    	},
      // 找回密码
      getUserPass(config){
        return Ajax.get("805076", config, true, true);
      },
      // 获取攻略详情
      getStrategy(config){
        return Ajax.get("625468", config, true, true);
      },
      // 攻略点赞
      getLink(config){
        return Ajax.get("625464", config, true, true);
      }
    };
});
