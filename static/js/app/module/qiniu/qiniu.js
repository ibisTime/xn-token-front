define([
    'app/util/ajax'
], function (Ajax) {

    var swfUrl = __uri("../../lib/qiniu/Moxie.swf");

    return {
        getQiniuToken: function (){
            return Ajax.get('805951');
        },
        uploadInit: function (option) {
            // this 即 editor 对象
            // 触发选择文件的按钮的id
            var btnId = option.btnId;
            var token = option.token;

            // 触发选择文件的按钮的父容器的id
            var containerId = option.containerId;

            // var dropId = editor.id || (editor.attr && editor.attr('id')) || 'jsForm';

            var multi_selection = option.multi_selection;

            // 创建上传对象
            var uploader = Qiniu.uploader({
                runtimes: 'html5,flash,html4', //上传模式,依次退化
                browse_button: btnId, //上传选择的点选按钮，**必需**
                //uptoken_url: '/uptoken',
                //Ajax请求upToken的Url，**强烈建议设置**（服务端提供）
                uptoken: token,
                //若未指定uptoken_url,则必须指定 uptoken ,uptoken由其他程序生成
                unique_names: false,
                // 默认 false，key为文件名。若开启该选项，SDK会为每个文件自动生成key（文件名）
                save_key: false,
                // 默认 false。若在服务端生成uptoken的上传策略中指定了 `sava_key`，则开启，SDK在前端将不对key进行任何处理
                //domain: 'http://oi99f4peg.bkt.clouddn.com/',
                domain: PIC_PREFIX,
                //bucket 域名，下载资源时用到，**必需**
                container: containerId, //上传区域DOM ID，默认是browser_button的父元素，
                max_file_size: '100mb', //最大文件体积限制
                flash_swf_url: swfUrl, //引入flash,相对路径
                multi_selection: multi_selection,
//              filters: {
//                  mime_types: [
//                      //只允许上传图片文件 （注意，extensions中，逗号后面不要加空格）
//                      {
//                          title: "图片文件",
//                          extensions: "jpg,jpeg,gif,png,bmp"
//                      }
//          //             , {
//                      //  title: '文件',
//                      //  extensions: "docx,doc,xls,xlsx,pdf"
//                      // }
//                  ]
//              },
                max_retries: 3, //上传失败最大重试次数
                // dragdrop: true, //开启可拖曳上传
                // drop_element: dropId, //拖曳上传区域元素的ID，拖曳文件或文件夹后可触发上传
                chunk_size: '4mb', //分块上传时，每片的体积
                auto_start: true, //选择文件后自动上传，若关闭需要自己绑定事件触发上传
                init: {
                    'FilesAdded': function(up, files) {
                        plupload.each(files, function(file) {
                            option.fileAdd && option.fileAdd(file, up);
                        });
                    },
                    'BeforeUpload': function(up, file) {
                        // 每个文件上传前,处理相关的事情
                        //printLog('on BeforeUpload');
                        if(file.type=='image/jpg' || file.type=='image/jpeg'  || file.type=='image/gif'  || file.type=='image/png'  || file.type=='image/bmp'){
                        	
                        }else{
                        	uploader.stop();
                        	up.removeFile(file);//清除file缓存
                        	alert('请选择图片上传！')
                        }
                    },
                    'UploadProgress': function(up, file) {
                        // 显示进度条
                        option.showUploadProgress && option.showUploadProgress(up, file);
                        // var uploaded = file.loaded;
                  //       var size = plupload.formatSize(uploaded).toUpperCase();
                  //       var formatSpeed = plupload.formatSize(file.speed).toUpperCase();
                  //       editor.find("#" + file.id)
                  //           .find(".progress-infos").text("已上传: " + size + " 上传速度： " + formatSpeed + "/s")
                  //           .parent().find(".progress-bar").css("width", parseInt(file.percent, 10) + "%");
                    },
                    'FileUploaded': function(up, file, info) {
                        // 每个文件上传成功后,处理相关的事情
                        // 其中 info 是文件上传成功后，服务端返回的json，形式如
                        // {
                        //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
                        //    "key": "gogopher.jpg"
                        //  }
                        //printLog(info);
                        // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html

                        var domain = up.getOption('domain');
                        var res = JSON.parse(info);
                        var sourceLink = domain + res.key; //获取上传成功后的文件的Url

                        // console.log(sourceLink);

                        // $("#showAvatar").attr("src", sourceLink).attr("data-src", res.key);
                        option.fileUploaded && option.fileUploaded(up, sourceLink, res.key, file);
                    },
                    'Error': function(up, err, errTip) {
                        //上传出错时,处理相关的事情
						//debugger;
                    },
                    'UploadComplete': function() {
                            //队列文件处理完毕后,处理相关的事情
                            //printLog('on UploadComplete');

                            // 隐藏进度条
                        option.hideUploadProgress && option.hideUploadProgress();
                    },
                    'Key': function(up, file) {
                        // 若想在前端对每个文件的key进行个性化处理，可以配置该函数
                        // 该配置必须要在 unique_names: false , save_key: false 时才生效
                        // do something with key here
                        var sourceLink = file.name;
                        var suffix = sourceLink.slice(0, sourceLink.lastIndexOf('.'));
                        var suffix1 = sourceLink.slice(sourceLink.lastIndexOf('.') + 1);
                        suffix = suffix + "_c_" + (new Date().getTime());
                        return suffix + "." + suffix1;
                    }
                }
            });
            // domain 为七牛空间（bucket)对应的域名，选择某个空间后，可通过"空间设置->基本设置->域名设置"查看获取
            // uploader 为一个plupload对象，继承了所有plupload的方法，参考http://plupload.com/docs
        }
    }
});
