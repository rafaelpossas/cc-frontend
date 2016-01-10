module.exports = function() {
    var client = './src';
    var clientApp = client + '/app/';
    var server = './server/';
    var config = {
        /**
         * File paths
         */
        alljs: [
            '!' + client + '/assets/js/**/*.js',
            client + '/**/*.js',
            './*.js'
        ],
        build: './build/',
        client: client,
        css: client + '/assets/css',
        fonts: client + '/assets/fonts',
        htmltemplates: clientApp + '**/*.html',
        images: client + '/assets/img',
        i18n: client + '/assets/i18n',
        html:[
            client + '/**/*.html',
        ],
        index: client + '/index.html',
        js:[
            '!' + client + '/assets/js/**/*.js',
            '!' + client + '/**/*.spec.js',
            client + '/**/*.module.js',
            client + '/**/*.js',
        ],
        karma: './karma.conf.js',
        sass: client + '/assets/css/scss',
        server: server,
        source: 'src/',
        temp: './.tmp/',
        /**
         * Bower and NPM Locations
         */
        bower: {
            json: require('./bower.json'),
            directory: client + '/assets/js/',
            ignorePath: '../..'
        },
        /**
         * Node Settings
         */
        defaultPort: 7203,
        nodeServer: './server/app.js',
        /**
         * browserSync
         */
        browserReloadDelay:1000,
        /**
         * template cache
         */
        templateCache : {
            file: 'templates.js',
            options: {
                module: 'app.core',
                standAlone: false,
                root: 'app/'
            }
        }
    };
    config.getWiredepDefaultOptions = function() {
        var options = {
            bowerJson: config.bower.json,
            directory: config.bower.directory,
            ignorePath: config.bower.ignore
        };
        return options;
    };
    return config;
};
