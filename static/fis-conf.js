fis.hook('amd', {
    baseUrl: "./js",
    paths: {
        'Handlebars': 'lib/handlebars.runtime-v3.0.3',
        'IScroll': "lib/iscroll/iscroll",
        'iScroll': "lib/iscroll/iscroll1",
        'jweixin': 'lib/jweixin-1.2.0',
        'jValidate': "lib/validate/jquery.validate",
        'jquery': "lib/jquery-2.1.4",
        'picker': "lib/picker/picker.min.js",
        'swiper': "lib/swiper/swiper-3.3.1.jquery.min",
        'Quill': "lib/quill/quill",
        'echarts': "lib/echarts/echarts",
        'NoCaptcha': "lib/NoCaptcha/index"
    },
    shim: {
        "IScroll": {
            exports: "IScroll"
        },
        "iScroll": {
            exports: "iScroll"
        }
    }
});
fis.match('*', {
    release: '/static/$0',
    //useMap: true
});
fis.match('*.html', {
    release: '/$0'
});
fis.match('*.{css,less,scss}', {
  preprocessor: fis.plugin('autoprefixer', {
    "browsers": ["Android >= 2.1", "iOS >= 4", "ie >= 8", "firefox >= 15"],
    "cascade": true
  })
})
fis.match('**/*.scss', {
    rExt: '.css',
    parser: fis.plugin('node-sass', {
        //fis-parser-node-sass option
    })
});
fis.match('{/js/app/controller/**.js,/js/app/interface/**.js,/js/app/module/**.js}', {
    parser: fis.plugin('babel-6.x', {
        sourceMaps: true,
        presets: [
            'latest', 'es2016', 'ES2015', 'stage-0'
        ]
    }),
    rExt: 'js'
});
fis.match('*.{js,css}', {
    useHash: true
}).match('config.js', {
    useHash: false
}).match('language.js', {
    useHash: false
}).match('errorCode.js', {
    useHash: false
});

//npm install -g fis-parser-handlebars-3.x
fis.match('*.handlebars', {
    rExt: '.js', // from .handlebars to .js 虽然源文件不需要编译，但是还是要转换为 .js 后缀
    parser: fis.plugin('handlebars-3.x', {
        //fis-parser-handlebars-3.x option
    }),
    release: false // handlebars 源文件不需要编译
});
fis.match('::package', {
    postpackager: fis.plugin('loader', {
        sourceMap: true,
        useInlineMap: true
    })
});
fis.media("prod")
    .match('::package', {
        postpackager: fis.plugin('loader', {
            allInOne: {
                includeAsyncs: true
            }
        })
    })
    .match('/js/require.js', {
        packTo: '/pkg/common.js',
        packOrder: -100
    })
    .match('/js/lib/jquery-2.1.4.js', {
        packTo: '/pkg/common.js',
        packOrder: -90
    })
    .match('{/js/app/util/ajax.js,/js/app/util/cookie.js,/js/app/util/dialog.js,/js/app/module/loading/index.js}', {
        requires: ['/js/require.js', '/js/lib/jquery-2.1.4.js'],
        packTo: '/pkg/common.js'
    })
    .match("**.js", {
        optimizer: fis.plugin('uglify-js')
    })
    .match("**.css", {
        optimizer: fis.plugin('clean-css')
    })
    .match('/js/app/config.js', {
        optimizer: null,
        packTo: '/config/config.js',
        useHash: false
    })
    .match('/js/app/language.js', {
        optimizer: null,
        packTo: '/language/language.js',
        useHash: false
    })
    .match('/js/app/errorCode.js', {
        optimizer: null,
        packTo: '/errorCode/errorCode.js',
        useHash: false
    })
    .match('**.png', {
        optimizer: fis.plugin('png-compressor')
    });
