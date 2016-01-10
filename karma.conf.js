// Karma configuration
// Generated on Wed Jan 06 2016 19:08:41 GMT+1100 (AUS Eastern Daylight Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
        {pattern: 'src/assets/i18n/en-us/main.json', watched: false, served: true, included: false},
        {pattern: 'src/app/**/*.mock.json', watched: false, served: true, included: false},
        // bower:js
        'src/assets/js/angular/angular.js',
        'src/assets/js/angular-ui-router/release/angular-ui-router.js',
        'src/assets/js/angular-loader/angular-loader.js',
        'src/assets/js/angular-mocks/angular-mocks.js',
        'src/assets/js/angular-international/dist/angular-international.js',
        'src/assets/js/jquery/dist/jquery.js',
        'src/assets/js/bootstrap-css/js/bootstrap.min.js',
        'src/assets/js/angular-cookies/angular-cookies.js',
        'src/assets/js/toastr/toastr.js',
        'src/assets/js/moment/moment.js',
        // endbower
        'src/assets/js/karma-read-json/karma-read-json.js',
        'src/app/**/*.module.js',
        'src/app/**/*.*',
        'src/app/**/*.spec.js'

    ],

    proxies: {
          "/assets/i18n/": "/base/src/assets/i18n/"
    },
    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
