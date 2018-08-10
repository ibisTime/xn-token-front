define([
    'app/controller/base',
    'app/interface/GeneralCtr',
    'app/interface/RedPacketCtr',
], function(base, GeneralCtr, RedPacketCtr) {
	var code = base.getUrlParam('code');
	var downloadUrl;
    
    init();
    
    function init(){
    	if(!code){
    		return;
    	}
    	$("title").html(base.getText('领取红包'));
    	$(".download-footer .txt").html(base.getText('下载THA钱包，即可提取'));
    	$(".download-footer .am-button").html(base.getText('下载提取'));
    	
    	base.showLoading();
    	getRedPacketDetail();
    	
        addListener();
    }
    
	// 获取红包详情
    function getRedPacketDetail(){
    	return RedPacketCtr.getRedPacketDetail({code, userId: base.getUserId()}).then((data) => {
    		base.hideLoading();
    		$(".detail-wrap .nickname").html(data.sendUserNickname);
    		$(".detail-wrap .photo").css({"background-image": "url('"+base.getAvatar(data.sendUserPhoto)+"')"});
    		$(".detail-wrap .txt2").html(data.greeting);
    		if (data.isReceived == '0') {
    			if(NOWLANG == 'cn') {
	    			if(data.status == '2') {
		    			$(".receivedNum-wrap").html(`<div class="receivedNum">${data.receiverList.length}/${data.sendNum}个红包&nbsp;&nbsp;&nbsp;${base.getTimeDifference(data.createDateTime, data.lastReceivedDatetime)}被抢完<div>`);
		    		} else {
		    			$(".receivedNum-wrap").html(`<div class="receivedNum">${data.receiverList.length}/${data.sendNum}个红包<div>`);
		    		}
	    		} else {
	    			$(".receivedNum-wrap").html(`<div class="receivedNum">Opened${data.receiverList.length}/${data.sendNum}<div>`);
	    		}
    		}
    		
    		var html = '';
    		var flag = false;
    		data.receiverList.forEach(item => {
    			if(item.userId == base.getUserId()){
    				$(".detail-wrap .count").html(item.count+'<samp>'+data.symbol+'</samp>');
    				$(".detail-wrap .countCNY").html(base.getText('价值') + item.countCNY );
    			}
    			if(!flag){
    				flag = true;
    				if (data.isReceived == '1') {
		    			if(NOWLANG == 'cn') {
			    			if(data.status == '2') {
				    			$(".receivedNum-wrap").html(`<div class="receivedNum">${data.receiverList.length}/${data.sendNum}个红包&nbsp;&nbsp;&nbsp;${base.getTimeDifference(data.createDateTime, data.lastReceivedDatetime)}被抢完</div>`);
				    		} else {
				    			$(".receivedNum-wrap").html(`<div class="receivedNum">${data.receiverList.length}/${data.sendNum}个红包</div>`);
				    		}
			    		} else {
			    			$(".receivedNum-wrap").html(`<div class="receivedNum">Opened${data.receiverList.length}/${data.sendNum}</div>`);
			    		}
		    		}
    			}
    			
    			var bestHtml = '';
    			if(data.bestHandUser == item.userId && data.type == '1' && data.status == '2'){
    				bestHtml = `<div class="isBest"><samp><i></i>${base.getText('手气最佳')}</samp></div>`;
    			}
    			
    			var  countCNY = `<div class="countCNY fr">${base.getText('价值') + item.countCNY}</div>`
    			
    			if(item.countCNY == '0' || item.countCNY == '0.00') {
    				countCNY = '';
    			}
    			
    			html += `<div class="item">
    					<div class="wp100 over-hide wrap">
							<div class="photo fl" style="background-image: url('${base.getAvatar(item.userPhoto)}')"></div>
							<div class="content fr">
								<div class="top">
									<div class="nickname fl">${item.userNickname}</div>
									<div class="count fr">${item.count} ${data.symbol}</div>
								</div>
								<div class="bottom">
									<div class="time fl">${base.formatDate(item.createDatetime, 'MM-dd hh:mm')}</div>
									${countCNY}
								</div>
							</div>
						</div>
						${bestHtml}
					</div>`;
    		})
    		$(".receiverList").html(html);
    		
    		
    	}, base.hideLoading)
    }
    
    function addListener(){
    	$("#downloadBtn").click(function(){
    		base.gohref("../public/download.html");
    	})
    }
});
