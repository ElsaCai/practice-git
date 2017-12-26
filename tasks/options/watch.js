/**
 * 1. Prevents issue where grunt dies from karma triggering multiple times.
 */
module.exports = function (grunt) {
  grunt.event.on('watch', function (action, filepath) {

    if (!filepath.startsWith('build') && filepath.endsWith('.js')) {
      grunt.config('changedFiles', filepath);
    }
  });

  var config = {
    options: {
      interrupt: false, /* [1] */
      livereload: true,
      spawn: false
    },
    sass_example: {
      files: [
        'src/styles/**/*.scss',
        'src/assets'
      ],
      tasks: [
        'sass:main_example',
        'notify:ready'
      ]
    },
    build_example: {
      files: [
        'build/js/*.js'
      ],
      tasks: [
        'notify:ready'
      ]
    },
    js: {
      files: [
        'src/scripts/**/*.js'
      ],
      tasks: [
        'eslint:changed_files',
        'karma:unit',
        'notify:ready'
      ]
    },
    unit: {
      files: [
        'test/unit/**/*.js'
      ],
      tasks: [
        'eslint:changed_files',
        'karma:unit'
      ]
    },
    jade_index: {
      files: [
        'src/index.jade'
      ],
      tasks: [
        'jade:index_example',
        'notify:ready'
      ]
    }
  };

  return config;
};
