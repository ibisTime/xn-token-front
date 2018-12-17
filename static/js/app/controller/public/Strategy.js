define([
    'app/controller/base',
    'app/util/ajax',
    'app/interface/GeneralCtr',
    'app/interface/UserCtr',
], function(base, Ajax, GeneralCtr, UserCtr) {

	var iosUpdateUrl,androidUpdateUrl;
	var lang = base.getUrlParam('lang') || 'ZH_CN';
	var channel = base.getUrlParam('channel') || 'theia';
	var firstLoad = true;
	var langValue = '';
	var strategyID = base.getUrlParam('strategyID') || '';
  var userId = base.getUrlParam('userId') || base.getUserId();
  var params = {
    id: strategyID
  };
  var isLike = null;
  var likeCount = 0;
    init();

    function init() {
      if(!strategyID) {
        return;
      }
      base.showLoading();
		  setHtml();
      addListener();
    }

    function setHtml() {
      $('.gl-zz .zz').html(base.getText('作者', lang));
      if(userId) {
        params.userId = userId;
      }
      UserCtr.getStrategy(params).then(data => {
        // data.isLike  0 否  1 是
        isLike = data.isLike;
        if(isLike === '1') {
          $('.gl-dz').addClass('gl-dzc');
          $('.gl-dz .dz').removeClass('hidden');
          $('.gl-dz .dzh').addClass('hidden');
        }
        likeCount = parseInt(data.likeCountFake) + parseInt(data.likeCount);
        $('.gl-txt').html(data.content);
        $('.dz-num').html(likeCount);
        $('.lr-num').html(parseInt(data.scanCountFake) + parseInt(data.scanCount));
        $('.gl-tit').html(data.title);
        $('.zzm').html(data.author);
        var spHtml = '';
        data.labelList.forEach(item => {
          spHtml += `<span>${item}</span>`
        });
        $('.gl-btns').html(spHtml);
        base.hideLoading();
      }, base.hideLoading());
    }

    function addListener(){
      $('.gl-dz').click(function() {

        if(userId && userId !== 'undefined') {
          if(isLike === '1') {  // 点过赞
            UserCtr.getLink({
              id: strategyID,
              userId,
            }).then(data => {
              isLike = '0';
              $('.gl-dz .dz').addClass('hidden');
              $('.gl-dz .dzh').removeClass('hidden');
              $('.gl-dz').removeClass('gl-dzc');
              likeCount --;
              $('.dz-num').html(likeCount);
            });
          }else {     // 还没点赞
            UserCtr.getLink({
              id: strategyID,
              userId,
            }).then(data => {
              isLike = '1';
              $('.gl-dz .dz').removeClass('hidden');
              $('.gl-dz .dzh').addClass('hidden');
              $('.gl-dz').addClass('gl-dzc');
              likeCount ++;
              $('.dz-num').html(likeCount);
            });
          }
        }else {
          base.showMsg(base.getText('还请登录后进行操作', lang));
        }
      })
    }
});