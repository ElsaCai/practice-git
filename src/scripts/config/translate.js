'use strict';

angular.module('example').config([
  '$translateProvider',
  '$translatePartialLoaderProvider',
  function (
    $translateProvider,
    $translatePartialLoaderProvider
  ) {
    $translateProvider
      .addInterpolation('$translateMessageFormatInterpolation')
      .useSanitizeValueStrategy('escapeParameters')
      .uniformLanguageTag('bcp47')
      .useLoader('$translatePartialLoader', {
        urlTemplate: 'locales/{lang}/{part}.json'
      })
      .preferredLanguage('en');

    $translatePartialLoaderProvider.setPart('en', 'example', require('../../locales/en/example.json'));
  }
]);
