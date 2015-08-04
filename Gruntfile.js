module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= pkg.license %> */\n',
        // Task configuration
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true,
                separator: ';\n'
            },
            dist: {
                src: [
                'lib/crowdy.js',
                'lib/routes.js',
                'lib/filters.js',
                'lib/directives/directives.js',
                'lib/controllers/instructions-controller.js',
                'lib/controllers/modal-controller.js',
                'lib/controllers/basic-sibling-controller.js',
                'lib/controllers/fast-sibling-controller.js',
                'lib/controllers/task-controller.js',
                'lib/controllers/tagging-task-controller.js',
                'lib/controllers/tagging-task-item-controller.js',
                'lib/controllers/relevance-task-controller.js',
                'lib/controllers/relevance-task-item-controller.js',
                'lib/controllers/feedback-controller.js'
                ],
                dest: 'dist/crowdy.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>',
                beautify: true
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/crowdy.min.js'
            }
        },
        jshint: {
            options: {
                node: true,
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                eqnull: true,
                browser: true,
                globals: { jQuery: true, angular: true, _: true },
                boss: true
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            autobuild: {
                files: '<%= concat.dist.src %>',
                tasks: ['newer:jshint:lib', 'concat', 'uglify']
                }
        },
        githooks: {
            all: {
                'pre-commit': 'jshint',
                'pre-push': 'concat uglify'
            }
        },
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-newer');

    // Default task
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};

