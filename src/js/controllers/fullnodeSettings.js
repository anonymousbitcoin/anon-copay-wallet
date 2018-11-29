'use strict';

angular.module('copayApp.controllers').controller('fullnodeSettingsController', function ($scope, $rootScope, $log, configService, platformInfo, setupFullnode) {

    var readConfig = function () {
    var config = configService.getSync();
    $rootScope.isFullnodeMode = config.wallet.isFullnodeMode;
  };

  var isAnonON = function () {
    setupFullnode.checkIfAnonFullnodeONService(function(data, status){
      $log.debug("data: ", data);
      $log.debug("status: ", status);
      if(status && status === 200)
        $rootScope.isAnonCoreON = true;
      else 
        $rootScope.isAnonCoreON = false;
    });
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
    isAnonON();
  });

});
