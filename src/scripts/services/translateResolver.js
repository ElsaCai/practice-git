'use strict';

angular.module('example').service('translateResolver', [
  '$translate',
  '$translatePartialLoader',
  function (
    $translate,
    $translatePartialLoader
  ) {
    this.resolve = function () {
      Array.from(arguments)
        .forEach(function (part) {
          $translatePartialLoader.addPart(part);
        });

      return $translate.refresh();
    };
  }
]);
