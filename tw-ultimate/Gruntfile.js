

module.exports = function (grunt) {

    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        concat: {
            libs: {
                src: 'js/lib/**/*.js',
                dest: 'build/libs.js',
            },
            components: {
                src: 'js/components/**/*.js',
                dest: 'build/components.js',
            }
        },
        concat_with_template: {
            your_target: {
                src: {
                    config: 'js/config.js',
                    starter: 'js/starter.js',
                    libs: 'build/libs.js',
                    components: 'build/components.js',
                    version: 'version'
                },
                dest: "tw-ultimate.user.js",
                tmpl: "main.template.js"
            },
        },
        watch: {
            scripts: {
                files: ['js/**/*.js', 'version'],
                tasks: ['concat', 'concat_with_template', 'jsbeautifier'],
            },
            css: {
                files: ['assets/css/flexboxgrid.css'],
                tasks: ['cssnanos']
            }
        },
        jsbeautifier: {
            files: ["js/**/*.js", "tw-ultimate.user.js"],
        },
        uglify: {
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'tw-ultimate.min.user.js': ['tw-ultimate.user.js']
                }
            }
        },
        cssnano: {
            dist: {
                files: {
                    'assets/css/flexboxgrid.min.css': 'assets/css/flexboxgrid.css'
                }
            }
        }

    });


    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-concat-with-template');
    grunt.loadNpmTasks("grunt-jsbeautifier");
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['cssnano']);
    



};