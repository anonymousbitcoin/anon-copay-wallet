'use strict';

angular.module('copayApp.controllers').controller('tabGovernanceController', function($rootScope, $timeout, $scope, appConfigService, $ionicModal, $log, lodash, platformInfo, configService, gettextCatalog) {

//   $scope.openExternalLink = function() {
//     var appName = appConfigService.name;
//     var url = appName == 'anon' ? 'https://github.com/anonymousbitcoin/anon-copay-wallet/issues' : 'https://help.bitpay.com/bitpay-app';
//     var optIn = true;
//     var title = null;
//     var message = gettextCatalog.getString('Help and support information is available at the website.');
//     var okText = gettextCatalog.getString('Open');
//     var cancelText = gettextCatalog.getString('Go Back');
//     externalLinkService.open(url, optIn, title, message, okText, cancelText);
//   };

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    $scope.isCordova = platformInfo.isCordova;
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    $scope.isDevel = platformInfo.isDevel;
    $scope.appName = appConfigService.nameCase;
    configService.whenAvailable(function(config) {
      $scope.locked = config.lock && config.lock.method;
      if (!$scope.locked || $scope.locked == 'none')
        $scope.method = gettextCatalog.getString('Disabled');
      else
        $scope.method = $scope.locked.charAt(0).toUpperCase() + config.lock.method.slice(1);
    });
  });


});
