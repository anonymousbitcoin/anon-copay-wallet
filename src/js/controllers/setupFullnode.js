'use strict';

angular.module('copayApp.controllers').controller('setupFullnodeController', function ($scope, $log, configService, platformInfo, setupFullnode) {

    var readConfig = function () {
    var config = configService.getSync();        
    $scope.isFullnodeDownloaded = config.wallet.isFullnodeDownloaded;
  };

  var configChange = function () {
    var opts = {
      wallet: {
        isFullnodeDownloaded: $scope.isFullnodeDownloaded
      }
    };
    configService.set(opts, function (err) {
      if (err) $log.debug(err);
    });
  };

  $scope.downloadAnonCore = function () { 
    $scope.installationStarted = true;
    setupFullnode.downloadAnon(function(error, res){
        $log.debug("left downloadAnon");
        $log.debug("error:", error);
        $log.debug("res:", res);
        if(error)
            $scope.isFullnodeDownloaded = false;
        else {
            $scope.downloadanonlog = res;
            $log.debug("downloadanonlog after assigning:", $scope.downloadanonlog);
            $scope.isFullnodeDownloaded = true;
        }
        configChange();
        $scope.$apply();
    });
  }

  $scope.startAnonCore = function () { 
    $scope.isAnonCoreON = true;
      $scope.$apply();
  }

  $scope.stopAnonCore = function () { 
    $scope.isAnonCoreON = false;
      $scope.$apply();
  }

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    readConfig();
    $scope.isFullnodeDownloaded = false;
    $scope.installationStarted = false;
  });

});
