module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'panel/lib/panel/css/thirdparty/*.css',
                    'panel/lib/panel/css/freeboard/styles.css'
                ],
                dest: 'panel/css/freeboard.css'
            },
            thirdparty : {
                src : [
                    [
                        'panel/lib/js/thirdparty/head.js',
                        'panel/lib/js/thirdparty/jquery.js',
                        'panel/lib/js/thirdparty/jquery-ui.js',
                        'panel/lib/js/thirdparty/knockout.js',
                        'panel/lib/js/thirdparty/underscore.js',
                        'panel/lib/js/thirdparty/jquery.gridster.js',
                        'panel/lib/js/thirdparty/jquery.caret.js',
						'panel/lib/js/thirdparty/jquery.xdomainrequest.js',
                        'panel/lib/js/thirdparty/codemirror.js',
                    ]
                ],
                dest : 'panel/js/freeboard.thirdparty.js'
            },
			fb : {
				src : [
					'panel/lib/js/freeboard/DatasourceModel.js',
					'panel/lib/js/freeboard/DeveloperConsole.js',
					'panel/lib/js/freeboard/DialogBox.js',
					'panel/lib/js/freeboard/FreeboardModel.js',
					'panel/lib/js/freeboard/FreeboardUI.js',
					'panel/lib/js/freeboard/JSEditor.js',
					'panel/lib/js/freeboard/PaneModel.js',
					'panel/lib/js/freeboard/PluginEditor.js',
					'panel/lib/js/freeboard/ValueEditor.js',
					'panel/lib/js/freeboard/WidgetModel.js',
					'panel/lib/js/freeboard/freeboard.js',
				],
				dest : 'panel/js/freeboard.js'
			},
            plugins : {
                src : [
                    'panel/plugins/freeboard/*.js'
                ],
                dest : 'panel/js/freeboard.plugins.js'
            },
            'fb_plugins' : {
                src : [
                    'panel/js/freeboard.js',
                    'panel/js/freeboard.plugins.js'
                ],
                dest : 'panel/js/freeboard_plugins.js'
            }
        },
        cssmin : {
            css:{
                src: 'panel/css/freeboard.css',
                dest: 'panel/css/freeboard.min.css'
            }
        },
        uglify : {
            fb: {
                files: {
                    'panel/js/freeboard.min.js' : [ 'panel/js/freeboard.js' ]
                }
            },
            plugins: {
                files: {
                    'panel/js/freeboard.plugins.min.js' : [ 'panel/js/freeboard.plugins.js' ]
                }
            },
            thirdparty :{
                options: {
                    mangle : false,
                    beautify : false,
                    compress: {}
                },
                files: {
                    'panel/js/freeboard.thirdparty.min.js' : [ 'panel/js/freeboard.thirdparty.js' ]
                }
            },
            'fb_plugins': {
                files: {
                    'panel/js/freeboard_plugins.min.js' : [ 'panel/js/freeboard_plugins.js' ]
                }
            }
        },
        'string-replace': {
            css: {
                files: {
                    'panel/css/': 'panel/css/*.css'
                },
                options: {
                    replacements: [{
                        pattern: /..\/..\/..\/img/ig,
                        replacement: 'panel/img'
                    }]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-string-replace');
    grunt.registerTask('default', [ 'concat:css', 'cssmin:css', 'concat:fb', 'concat:thirdparty', 'concat:plugins', 'concat:fb_plugins', 'uglify:fb', 'uglify:plugins', 'uglify:fb_plugins', 'uglify:thirdparty', 'string-replace:css' ]);
};
