'use strict';

module.exports = {
  files: {
    dependencies: [
      'node_modules/jquery/dist/jquery.min.js',
      'src/scripts/components.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'src/scripts/main.js'
    ],
    excluded: [],
    tests: [
      'test/unit/**/*.spec.js'
    ]
  }
};
