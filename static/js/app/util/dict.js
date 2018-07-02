define([
    'app/controller/base',
    'app/util/ajax'
], function(base, ajax) {
    var dict = {
        // 商城订单状态
        mallOrderStatus: {
            "1": "待支付",
            "2": "待发货",
            "3": "待收货",
            "4": "待评价",
            "5": "已评价",
            "91": "用户取消",
            "92": "平台取消",
            "93": "快递异常",
        },
        // 租赁订单状态
        leaseOrderStatus: {
            "1": "待支付",
            "2": "待发货",
            "3": "待收货",
            "4": "体验中",
            "5": "待确认",
            "6": "逾期中",
            "7": "已结算，待评论",
            "8": "不归还",
            "9": "已评论",
            "91": "用户取消",
            "92": "平台取消",
            "93": "快递异常",
        },
        studentCreditStatus: {
			'0':'审核中',
			'1':'审核通过',
			'2':'审核未通过，请重新申请',
		},
		expressDict: {
			"SF":"顺丰到付"
		}
    };

    var changeToObj = function(data) {
        var data = data || [],
            obj = {};
        data.forEach(function(item) {
            obj[item.dkey] = item.dvalue;
        });
        return obj;
    };

    return {
        get: function(code) {
            return dict[code];
        }
    }
});
