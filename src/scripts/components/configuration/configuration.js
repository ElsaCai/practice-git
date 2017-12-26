'use strict';
var app = angular.module('example');
app.directive('setConfig', [
  function () {
    return {
      controller: 'ConfigurationController',
      controllerAs: 'configurationCtrl',
      template: require('../configuration/configuration.jade')()
    };
  }
]);

