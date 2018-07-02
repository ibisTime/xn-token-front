define(['Handlebars'], function(Handlebars) {
    Handlebars.registerHelper('formatMoney', function(num, options) {
        if (!num && num !== 0)
            return "--";
        num = +num / 1000;
        num = (num + "").replace(/^(\d+\.\d\d)\d*/i, "$1");
        return (+ num).toFixed(2);
    });
    Handlebars.registerHelper('formatImage', function(pic, options) {
        if (!pic)
            return "";
        pic = pic.split(/\|\|/)[0];
        if (/^http/.test(pic)) {
            return pic;
        }
        return PIC_PREFIX + pic;
    });
    Handlebars.registerHelper('formatSquareImage', function(pic, options) {
        if (!pic)
            return "";
        pic = pic.split(/\|\|/)[0];
        if (/^http/.test(pic)) {
            return pic;
        }
        return PIC_PREFIX + pic + "?imageMogr2/auto-orient/thumbnail/!200x200r";
    });
    Handlebars.registerHelper('formatRectImage', function(pic, options) {
        if (!pic)
            return "";
        pic = pic.split(/\|\|/)[0];
        if (/^http/.test(pic)) {
            return pic;
        }
        return PIC_PREFIX + pic + "?imageMogr2/auto-orient/thumbnail/!150x113r";
    });
    Handlebars.registerHelper('formatBigRectImage', function(pic, options) {
        if (!pic)
            return "";
        pic = pic.split(/\|\|/)[0];
        if (/^http/.test(pic)) {
            return pic;
        }
        return PIC_PREFIX + pic + "?imageMogr2/auto-orient/interlace/1";
    });
    Handlebars.registerHelper('formatAvatar', function(pic, options) {
        if (!pic) {
            return '/static/images/avatar.png';
        }
        pic = pic.split(/\|\|/)[0];
        if (/^http/.test(pic)) {
            return pic;
        }
        return PIC_PREFIX + pic + "?imageMogr2/auto-orient/thumbnail/!200x200r";
    });
    Handlebars.registerHelper('formatDateTime', function(date, options) {
        if (!date)
            return "--";
        return new Date(date).format("yyyy-MM-dd hh:mm:ss");
    });
    Handlebars.registerHelper('formatDateTime1', function(date, options) {
        if (!date)
            return "--";
        return new Date(date).format("yyyy-MM-dd hh:mm");
    });
    Handlebars.registerHelper('formatDate', function(date, options) {
        if (!date)
            return "--";
        return new Date(date).format("yyyy-MM-dd");
    });
    Handlebars.registerHelper('formateTime', function(date, options) {
        if (!date)
            return "--";
        return new Date(date).format("hh:mm");
    });
    Handlebars.registerHelper('clearTag', function(des, options) {
        return des && des.replace(/<[^>]+>|<\/[^>]+>|<[^>]+\/>|&nbsp;/ig, "") || "";
    });
    Handlebars.registerHelper('safeString', function(text, options) {
        return new Handlebars.SafeString(text);
    });
    Handlebars.registerHelper('formatAddress', function(val, options) {
        var data = options.data.root.items[options.data.index];
        if(data.city == data.province) {
            data.city = "";
        }
        return (data.province || "") + (data.city || "") + (data.area || "") + data.address;
    });
    Handlebars.registerHelper('defaultProductPrice', function(options) {
    	var data = options.data.root.items[options.data.index];
    	var price = '';
    	
		if(data.category==JFPRODUCTTYPE){
    		price = (options.data.root.items[options.data.index].productSpecsList[0].price2/1000).toFixed(2)+'积分';
    	}else{
    		price = '￥'+(options.data.root.items[options.data.index].productSpecsList[0].price1/1000).toFixed(2);
    	}
    
        return price;
    });
    Handlebars.registerHelper('defaultLeaseProductOPrice', function(options) {
        var data = +options.data.root.items[options.data.index].originalPrice;
        
        return (data / 1000).toFixed(2);
    });
    Handlebars.registerHelper('formatLocation', function(options) {
    	var data = options.data.root.items[options.data.index];
    	var location='';
    	if(data.location=='0'){
    		location = 'hidden';
    	}
        
        return location;
    });
    Handlebars.registerHelper('formatCommentStar', function(score,options) {
    	var data = options.data.root.items[options.data.index];
    	var active='';
    	if(score<=data.score){
    		active = 'active';
    	}
        
        return active;
    });
    Handlebars.registerHelper('defaultLeaseProductPrice', function(options) {
    	var data = options.data.root.items[options.data.index];
    	var price = '';
    	
		if(data.type==JFLEASEPRODUCTTYPE){
    		price = (options.data.root.items[options.data.index].price2/1000).toFixed(2)+'积分';
    	}else{
    		price = '￥'+(options.data.root.items[options.data.index].price1/1000).toFixed(2);
    	}
    
        return price;
    });
    Handlebars.registerHelper('defaultProductOPrice', function(options) {
        var data = +options.data.root.items[options.data.index].productSpecsList[0].originalPrice;
        
        return (data / 1000).toFixed(2);
    });
    
    Handlebars.registerHelper('formatLeaseIsCollect', function(isCollect,options) {
    	var active='';
    	if(isCollect=='1'){
    		active = 'active';
    	}
        
        return active;
    });
    
    return Handlebars;
});
