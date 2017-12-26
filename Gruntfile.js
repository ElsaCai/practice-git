'use strict';

var path = require('path');

module.exports = function(grunt, undefined) {
  if (grunt.option('coverage') === undefined) {
    grunt.option('coverage', true);
  }
  if (grunt.option('single-run') === undefined) {
    grunt.option('single-run', true);
  }
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'tasks/options'),
    init: true,
    data: {
      pkg: grunt.file.readJSON('package.json'),
      env: process.env,
      options: {
        host: grunt.option('host'),
        coverage: grunt.option('coverage')
      }
    },
    loadGruntTasks: {
      pattern: 'grunt-*'
    }
  });

  grunt.registerTask(
    'build:templates',
    'Compile view and partials templates',
    [
      'jade:index_example'
    ]);

  grunt.registerTask(
    'build',
    'Compile all source code for development',
    [
      'clean',
      'sass:main_example',
      'build:templates',
      'copy:styles',
      'browserify:source_example',
      'browserify:components_example'
    ]);

  grunt.registerTask(
    'default',
    'Lint, build, watchify and Karma',
    [
      'eslint:local',
      'build',
      'karma:unit',
      'concurrent:development'
    ]);

  grunt.registerTask(
    'test',
    'single run tests',
    [
      'eslint:local',
      'build',
      'karma:unit'
    ]);
};
