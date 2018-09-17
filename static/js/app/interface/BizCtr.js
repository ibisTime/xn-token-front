define([
    'app/controller/base',
    'app/util/ajax'
], function(base, Ajax) {
    return {
    	//抽奖
    	luckDraw(userId) {
    		return Ajax.get("625440",{userId}, true);
    	},
    	// 列表获取中奖名单
    	getListPrizeWinner() {
    		return Ajax.get("625441",{}, true);
    	}
    };
})
