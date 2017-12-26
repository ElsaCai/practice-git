'use strict';

describe('Directive: setConfig', function () {
  var suite = {};

  beforeEach(angular.mock.module('example'));

  beforeEach(inject(function ($injector) {
    suite.$compile = $injector.get('$compile');
    suite.scope = $injector.get('$rootScope').$new();
  }));

  describe('default', function () {
    beforeEach(function () {
      var template = '<unifi-config-world />';

      suite.element = suite.$compile(template)(suite.scope);
      suite.scope.$apply();
      suite.controller = suite.element.controller('setConfig');
    });

    afterEach(function () {
      suite.element.remove();
      suite.scope.$destroy();
      suite = {};
    });
  });
});
