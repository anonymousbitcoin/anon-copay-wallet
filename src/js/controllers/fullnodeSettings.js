'use strict';

angular.module('copayApp.controllers').controller('fullnodeSettingsController', function ($scope, $rootScope, $log, configService, platformInfo) {

    var readConfig = function () {
    var config = configService.getSync();
    $rootScope.isFullnodeMode = config.wallet.isFullnodeMode;
  };

  $scope.fullNodeChange = function () {
    $rootScope.isFullnodeMode = $rootScope.isFullnodeMode ? false : true;
    var opts = {
      wallet: {
        isFullnodeMode: $rootScope.isFullnodeMode
      }
    };
    configService.set(opts, function (err) {
      if (err) $log.debug(err);
    });
  };

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    readConfig();
    // checkIfAnonON();
  });

});
