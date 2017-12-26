'use strict';

function HomeController (
  translateResolver
) {
  translateResolver.resolve('example');
}

HomeController.$inject = [
  'translateResolver'
];

angular.module('example').controller('HomeController', HomeController);
