'use strict';

angular.module('example').directive('unifiHelloWorld', [
  function () {
    return {
      controller: 'HelloWorldController',
      controllerAs: 'helloWorldCtrl',
      template: require('./helloWorld.jade')()
    };
  }
]);

