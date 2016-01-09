var gulp = require('gulp');
var args = require('yargs').argv;
var browserSync = require('browser-sync');
var config = require('./gulp.config')();
var del = require('del');
var stylish = require('gulp-jscs-stylish');

var $ = require ('gulp-load-plugins')({lazy:true});
var port = process.env.PORT || config.defaultPort;

gulp.task('help', $.taskListing);

gulp.task('default',['help']);

gulp.task('vet',function() {
    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.alljs)
        .pipe($.if(args.verbose, $.print()))
        .pipe($.jscs())
        .pipe(stylish())
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish',{verbose:true}))
        .pipe($.jshint.reporter('fail'));
});
gulp.task('build-copy-fonts',function() {
    log('Copying Fonts');
    return gulp
        .src(config.fonts + '/**/*.*')
        .pipe(gulp.dest(config.build + 'assets/fonts'));

});
gulp.task('build-copy-images',function() {
    log('Compressing and Copying the images');
    return gulp
        .src(config.images + '/**/*.*')
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'assets/images'));
});
gulp.task('build-copy-i18n',function() {
    log('Copying the internationalisation files (i18n)');
    return gulp
        .src(config.i18n + '/**/*.*')
        .pipe(gulp.dest(config.build + 'assets/i18n'));
});
gulp.task('build-copy-css',function() {
    log('Copying css');
    return gulp
        .src(config.css + '/app.css')
        .pipe(gulp.dest(config.build + 'assets/css'));
});
gulp.task('inject',['wiredep','styles','templatecache'],function() {
    log('Wire up the app css into the html, and call wiredep');
    return gulp
        .src(config.index)
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
})
gulp.task('optimize',['inject'],function() {
    log('Optimizing the javascript, css, html');
    var templateCache = config.temp + config.templateCache.file;
    var assets = $.useref({searchPath:'./src'});
    return gulp
        .src(config.index)
        .pipe($.plumber())
        //.pipe($.inject(gulp.src(templateCache,{read:false}),{
        //    starttag: '<!-- inject:templates:js -->'
        //}))
        .pipe(assets)
        .pipe(gulp.dest(config.build));
});
gulp.task('clean-build',function() {
    return clean(config.build,{read:false});
});

gulp.task('templatecache',['clean-build'],function() {
    log('Creating AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        .pipe($.htmlmin({empty:true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options))
        .pipe(gulp.dest(config.temp));
});

gulp.task('clean-styles',function() {
    return clean(config.css + '/app.css');
});
gulp.task('styles',['clean-styles'],function() {
    log('Compiling Less --> CSS');
    return gulp
        .src(config.sass + '/app.scss')
        .pipe($.plumber(error))
        .pipe($.sass())
        .pipe($.autoprefixer({
            browsers: ['last 2 versions','> 5%']
        }))
        .pipe(gulp.dest(config.css));
});

gulp.task('sass-watcher',function() {
    gulp
        .watch([config.sass + '/**/*.scss'],['styles']);
});
gulp.task('wiredep',function() {
    log('Wire up the bower css js and our app js into the html');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe($.inject(gulp.src(config.js,{read:false}),{ignorePath: 'src',addRootSlash: false}))
        .pipe(gulp.dest(config.client));
});
gulp.task('wiredep:karma',function() {
    log('Wire up the bower css js and our app js into the karma.conf.js');
    var options = config.getWiredepDefaultOptions();
    var wiredep = require('wiredep').stream;
    return gulp
        .src(config.karma)
        .pipe(wiredep(options))
        .pipe(gulp.dest('./'));
});
gulp.task('serve-dev',['styles','wiredep'],function() {
    var isDev = true;
    var nodeOptions = {
        script: config.nodeServer,
        delayTime: 1,
        env: {
            'PORT': port,
            'NODE_ENV': isDev ? 'dev' : 'build'

        },
        watch: [config.server]
    };
    return $.nodemon(nodeOptions)
        .on('restart',function(ev) {
            log('*** nodemon restarted');
            log('files changed on restart:\n' + ev);
            setTimeout(function() {
                browserSync.notify('reloading now...');
                browserSync.reload({stream:false});
            },config.browserReloadDelay);
        })
        .on('start',function() {
            log('*** nodemon started');
            startBrowserSync();
        })
        .on('crash',function() {
            log('*** nodemon crashed');
        })
        .on('exit',function() {
            log('*** nodemon exited cleanly');
        });

});
//////////////////
function changeEvent(event) {
    var srcPattern = new RegExp('/.*(?=/' + config.source + ')/');
    log('File ' + event.path.replace(srcPattern, '') + ' ' + event.type);
}
function startBrowserSync() {
    if (args.nosync || browserSync.active) {
        log('Browser is active!');
        return;
    }else {
        log('Starting browser-sync on port ' + port);

        gulp
            .watch([config.sass + '/**/*.scss'],['styles'])
            .on('change',function(event) {
                changeEvent(event);
            });
        var options = {
            proxy: 'localhost:' + port,
            port: 3000,
            files:[
                config.client + '**/*.*',
                config.css + '/app.css'

            ],
            ghostMode:{
                clicks: true,
                location: false,
                forms: true,
                scroll:true
            },
            injectChanges: true,
            logFileChanges: true,
            logLevel: 'debug',
            logPrefix: 'customer compass',
            notify: true,
            reloadDelay: 1000
        };
        browserSync(options);
    }

}
function error (err) {
    $.util.log($.util.colors.red(err.message));
    this.emit('end');
}
function clean(path) {
    log('Cleaning: ' + $.util.colors.blue(path));
    return del(path);
}
function log(msg) {
    if (typeof(msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
