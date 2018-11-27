'use strict';

angular.module('copayApp.controllers').controller('fullnodeSettingsController', function ($scope, $log, configService, platformInfo) {

    var readConfig = function () {
    var config = configService.getSync();

    $scope.isFullnodeMode = config.wallet.isFullnodeMode;
  };

  $scope.fullNodeChange = function () {
    var opts = {
      wallet: {
        isFullnodeMode: $scope.isFullnodeMode
      }
    };
    configService.set(opts, function (err) {
      if (err) $log.debug(err);
    });
  };

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    readConfig();
  });

});
