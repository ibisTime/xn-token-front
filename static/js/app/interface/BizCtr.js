define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
    	//抽奖
    	luckDraw(userId) {
    		return Ajax.get("805951",{userId}, true);
    	},
    	// 列表获取获奖人
    	getListPrizeWinner() {
    		return Ajax.get("805951",{}, true);
    	}
    };
})
