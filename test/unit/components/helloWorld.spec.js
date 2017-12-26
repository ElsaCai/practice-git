'use strict';

describe('Directive: unifiHelloWorld', function () {
  var suite = {};

  beforeEach(angular.mock.module('example'));

  beforeEach(inject(function ($injector) {
    suite.$compile = $injector.get('$compile');
    suite.scope = $injector.get('$rootScope').$new();
  }));

  describe('default', function () {
    beforeEach(function () {
      var template = '<unifi-hello-world />';

      suite.element = suite.$compile(template)(suite.scope);
      suite.scope.$apply();
      suite.controller = suite.element.controller('unifiHelloWorld');
    });

    afterEach(function () {
      suite.element.remove();
      suite.scope.$destroy();
      suite = {};
    });

    it('should have a headline', function () {
      expect(suite.element.find('.unifiTest__headline').length).toBe(1);
    });
  });
});
