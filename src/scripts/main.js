'use strict';

// ## Module definition
// Define our apps module and an array of other required modules.

angular.module('example', [
  'ngSanitize',
  'pascalprecht.translate',
  'ui.router'
]);

// ## Source Requires

require('./*/**/*.js', {mode: 'expand'});
