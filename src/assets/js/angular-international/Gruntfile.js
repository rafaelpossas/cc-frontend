module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        concat: {
            js: {
                src: ['src/modules/*.js', 'src/**/*.js'],
                dest: 'dist/angular-international.js'
            }
        },
        uglify: {
            js: {
                files: {
                    'dist/angular-international.min.js': ['dist/angular-international.js']
                }
            }
        },
        karma: {
            unit: {
                configFile: 'karma.conf.js'
            },
            dist: {
                configFile: 'karma.conf.js'
            }
        },
        watch: {
            scripts: {
                files: ['src/**/*.js', 'test/**/*.spec.js'],
                tasks: ['karma']
            }
        }
    });

    grunt.registerTask('build', [
        'karma:unit',
        'concat',
        'uglify',
        'karma:dist'
    ]);
};