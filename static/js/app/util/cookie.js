define([], function() {
	var cookieUtil = {
		set: function(name, value, expires) {
			var expr = "";
	        if(!expires){
	            var Days = 30;
	    		var exp = new Date();
	    		exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	            expr = ";expires=" + exp.toGMTString()
	        }
			document.cookie = name + "=" + escape(value) + expr + ";path=/;";
		},

		get: function(name) {
			var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
			if (arr = document.cookie.match(reg))
				return unescape(arr[2]);
			else
				return null;
		},

		del: function(name) {
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			var cval = cookieUtil.get(name);
			if (cval != null)
				document.cookie = name + "=" + cval + ";expires="
						+ exp.toGMTString() + ";path=/;";
		}
	};
	return cookieUtil;
});
