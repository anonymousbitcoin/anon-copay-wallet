
'use strict';
angular.module('copayApp.services')
  .factory('sjcl', function bitcoreAnonFactory(bwcService) {
    var sjcl = bwcService.getSJCL();
    return sjcl;
  });
