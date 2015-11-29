module.exports = function(grunt) {

    // displays the elapsed execution time of grunt tasks
    require('time-grunt')(grunt);

    // reads package.json file,  and looks for any plugins in the dependencies
    //and devDependencies list that start with 'grunt-' and loads them automatically
    require('load-grunt-tasks')(grunt);

// http://kroltech.com/2013/12/29/boilerplate-web-app-using-backbone-js-expressjs-node-js-mongodb/
// http://cnpmjs.org/package/ejs-browserify-transformer
// http://bi3x.net/%D1%83%D0%BC%D0%BD%D1%8B%D0%B9-front-end-%D0%B8%D0%BB%D0%B8-%D0%BD%D0%B0%D0%BA%D0%BE%D0%BD%D0%B5%D1%86-%D1%82%D0%BE-%D1%8F-%D1%80%D0%B5%D1%88%D0%B8%D0%BB%D1%81%D1%8F-%D1%87%D0%B0%D1%81%D1%82%D1%8C-3/
// http://habrahabr.ru/post/224825/
// http://jasmine.github.io/2.0/introduction.html
    //http://danburzo.ro/grunt/chapters/<%= appConfig.build %>ing/

    // Project configuration.
    grunt.initConfig({

        // config the roots so that not to repeat yourself
        appConfig: {
            public: 'public',
            dist: 'dist',
            build: 'build'
        },

        pkg: grunt.file.readJSON('package.json'),

        // reads the bower.json file and installs any front-end dependencies
        bower: {
            install: {
                options: {
                    targetDir: '<%= appConfig.public %>/js/lib',
                    layout: 'byType',
                    verbose: false, // provides debug output
                    bowerOptions: {
                        forceLatest: true, // Force latest version on conflict
                        production: false // Do not install project devDependencies on production
                    }
                }
            }
        },

        // cleans <%= appConfig.build %> folders before each <%= appConfig.build %>
        clean: {
            '<%= appConfig.build %>': ['<%= appConfig.build %>'],
            dev: {
                src: ['<%= appConfig.build %>/app.js', '<%= appConfig.build %>/<%= pkg.name %>.css', '<%= appConfig.build %>/<%= pkg.name %>.js']
            },
            prod: ['<%= appConfig.dist %>']
        },

        // merges files into a single file
        browserify: {
            vendor: {
                src: ['<%= appConfig.public %>/js/lib/*.js', '<%= appConfig.public %>/js/i18n.js'],
                dest: '<%= appConfig.build %>/vendor.js',
                options: {
                    shim: {
                        jquery: {
                            path: '<%= appConfig.public %>/js/lib/jquery-2.1.4.min.js'
                        },
                        underscore: {
                            path: '<%= appConfig.public %>/js/lib/underscore-1.4.2.js'
                        },
                        'underscore.string': {
                            path: '<%= appConfig.public %>/js/lib/underscore.string-3.2.2.min.js',
                            depends: {
                                underscore: 'underscore'
                            }
                        },
                        backbone: {
                            path: '<%= appConfig.public %>/js/lib/backbone-0.9.2.js',
                            depends: {
                                underscore: 'underscore'
                            }
                        },
                        i18n: {
                            path: '<%= appConfig.public %>/js/i18n.js',
                            depends: {
                                jquery: 'jquery'
                            }
                        }
                    }
                }
            },
            app: {
                files: {
                    '<%= appConfig.build %>/app.js': ['<%= appConfig.public %>/js/main.js']
                },
                options: {
                    transform: ['node-underscorify'],
                    // transform: ['hbsfy'],
                    external: ['jquery', 'underscore', 'backbone'],
                    debug: true
                }
            },
            test: {
                files: {
                    '<%= appConfig.build %>/tests.js': [
                        '<%= appConfig.public %>/spec/**/*.test.js'
                    ]
                },
                options: {
                    transform: ['node-underscorify'],
                    // transform: ['hbsfy'],
                    external: ['jquery', 'underscore', 'backbone']
                }
            }
        },

        less: {
            transpile: {
                files: {
                    '<%= appConfig.build %>/<%= pkg.name %>.css': [
                        '<%= appConfig.public %>/**/*.css',
                        '<%= appConfig.public %>/**/*.less'
                    ]
                }
            }
        },

        // concatenates vendor.js file and app.js file, created by Browserify,
        // into a single file and puts it in the <%= appConfig.build %> directory
        concat: {
            '<%= appConfig.build %>/<%= pkg.name %>.js': ['<%= appConfig.build %>/vendor.js', '<%= appConfig.build %>/app.js']
        },

        // copies the files from the <%= appConfig.build %> directory to the destination that they must reside
        // so that our front-end app can see them and our server can serve them
        copy: {
            dev: {
                files: [{
                    src: '<%= appConfig.build %>/<%= pkg.name %>.js',
                    dest: '<%= appConfig.dist %>/js/<%= pkg.name %>.js'
                }, {
                    src: '<%= appConfig.build %>/<%= pkg.name %>.css',
                    dest: '<%= appConfig.dist %>/css/<%= pkg.name %>.css'
                }, {
                    expand: true,
                    cwd: '<%= appConfig.public %>/assets',
                    dest: '<%= appConfig.dist %>/assets',
                    src: [
                        '**'
                    ],
                    filter: 'isFile'
                }]
            },
            prod: {
                files: [{
                    expand: true,
                    cwd: '<%= appConfig.public %>/assets',
                    dest: '<%= appConfig.dist %>/assets',
                    src: [
                        '**'
                    ],
                    filter: 'isFile'
                }]
            }
        },

        // compresses the css file
        cssmin: {
            minify: {
                src: ['<%= appConfig.build %>/<%= pkg.name %>.css'],
                dest: '<%= appConfig.dist %>/css/<%= pkg.name %>.css'
            }
        },

        // compresses the js file
        uglify: {
            compile: {
                options: {
                    compress: true,
                    verbose: true
                },
                files: [{
                    src: '<%= appConfig.build %>/<%= pkg.name %>.js',
                    dest: '<%= appConfig.dist %>/js/<%= pkg.name %>.js'
                }]
            }
        },

        // watch all files for any time they get modified
        watch: {
            scripts: {
                files: ['<%= appConfig.public %>/templates/*.html', '<%= appConfig.public %>/js/**/*.js'],
                tasks: ['clean:dev', 'browserify:app', 'concat', 'copy:dev']
            },
            less: {
                files: ['<%= appConfig.public %>/css/**/*.less', '<%= appConfig.public %>/css/**/*.css'],
                tasks: ['less:transpile', 'copy:dev']
            },
            test: {
                files: ['<%= appConfig.build %>/app.js', '<%= appConfig.public %>/spec/**/*.test.js'],
                tasks: ['browserify:test']
            },
            karma: {
                files: ['<%= appConfig.build %>/tests.js'],
                tasks: ['jshint:test', 'karma:watcher:run']
            }
        },

        // restarts the server whenever a node.js server file is changed
        nodemon: {
            dev: {
                options: {
                    file: './server.js',
                    nodeArgs: ['--debug'],
                    watchedFolders: ['views', 'routes', 'models', 'middleware', 'locales', 'boot', 'lib'],
                    env: {
                        PORT: '3000'
                    }
                }
            }
        },

        // command line execution to start the mongod server
        shell: {
            mongo: {
                command: 'mongod',
                options: {
                    async: true
                }
            }
        },

        // executes a number of tasks asynchronously at the same time
        concurrent: {
            dev: {
                tasks: ['nodemon:dev', 'shell:mongo', 'watch:scripts', 'watch:less', 'watch:test'],
                options: {
                    logConcurrentOutput: true
                }
            },
            test: {
                tasks: ['watch:karma'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },

        // tasks specific to running the Karma test runner and watcher
        karma: {
            options: {
                configFile: 'karma.conf.js'
            },
            watcher: {
                background: true,
                singleRun: false
            },
            test: {
                singleRun: true
            }
        },

        // runs jsHint syntax checking on all necessary .js files
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporterOutput: 'jshint.log'
            },
            all: ['Gruntfile.js', '<%= appConfig.public %>/js/**/*.js', '<%= appConfig.public %>/spec/**/*.js'],
            dev: ['<%= appConfig.public %>/js/**/*.js'],
            test: ['<%= appConfig.public %>/spec/**/*.js']
        }

    });


    // sets up command line commands to execute all above stuff
    // by doing $ grunt mytask

    // Should be executed only once to do a Bower install of project vendor dependencies
    grunt.registerTask('init:dev', ['clean', 'bower', 'browserify:vendor']);

    // handles the tasks that are repeated every time you make a change and need
    // to re<%= appConfig.build %> all of your files
    grunt.registerTask('build:dev', ['clean:dev', 'browserify:app', 'browserify:test',
        //'jshint:dev',
        'less:transpile', 'concat', 'copy:dev']);
    grunt.registerTask('build:prod', ['clean:prod', 'browserify:vendor', 'browserify:app',
        //'jshint:all',
        'less:transpile', 'concat', 'cssmin', 'uglify', 'copy:prod']);

    // does a <%= appConfig.build %>:dev, and then concurrent:dev which launches all of the watchers and servers
    grunt.registerTask('server', ['build:dev', 'concurrent:dev']);

    // 'test:<%= appConfig.public %>' runs once, and 'tdd' will run Karma in auto watch mode
    grunt.registerTask('test:public', ['karma:test']);
    grunt.registerTask('tdd', ['karma:watcher:start', 'concurrent:test']);


    // Default task(s).
    grunt.registerTask('default', ['build:dev']);

};