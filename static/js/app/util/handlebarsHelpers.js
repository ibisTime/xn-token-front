define([
    'Handlebars'
], function(Handlebars) {
    Handlebars.registerHelper('formatNumber', function(num, places, times, pre, options){
        if (typeof num == 'undefined') {
            num = '--';
        }
        if (typeof num != 'number') {
            return num;
        }
        num = +(num || 0) * times;
        return (pre && num > 0 ? '+' : '') + num.toFixed(places);
    });
    Handlebars.registerHelper('formatZeroMoney', function(num, places, options){
        if (typeof num == 'undefined' || typeof num != 'number') {
            return 0;
        }
        num = +(num || 0) / 1000;
        return num.toFixed(places || 0);
    });

    Handlebars.registerHelper('compare', function(v1, v2, res1, res2, res3, options){
        if (v1 > v2) {
            return res1;
        } else if (v1 = v2) {
            return res2;
        } else {
            return res3;
        }
    });

    Handlebars.registerHelper('safeString', function(text, options){
        return new Handlebars.SafeString(text);
    });

    Handlebars.registerHelper('formateDateTime', function(date, options){
        return date ? new Date(date).format("yyyy-MM-dd hh-mm-ss") : "--";
    });
    Handlebars.registerHelper('formatePointDate', function(date, options){
        return date ? new Date(date).format("yyyy.MM.dd") : "--";
    });

    return Handlebars;
});