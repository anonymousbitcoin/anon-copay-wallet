'use strict';
angular.module('copayApp.services')
  .factory('bitcoreAnon', function bitcoreAnonFactory(bwcService) {
    var bitcoreAnon = bwcService.getBitcoreAnon();
    return bitcoreAnon;
  });
