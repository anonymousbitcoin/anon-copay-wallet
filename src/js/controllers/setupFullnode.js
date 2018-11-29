'use strict';

angular.module('copayApp.controllers').controller('setupFullnodeController', function ($scope, $rootScope, $log, configService, platformInfo, setupFullnode, networkStatsService) {

  var readConfig = function () {
    var config = configService.getSync();
    $scope.isFullnodeDownloaded = config.wallet.isFullnodeDownloaded;
  };

  var fetchNetworkStats = function () {
    return networkStatsService.getInfo();
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
    setupFullnode.downloadAnon(function (error, res) {
      // $log.debug("left downloadAnon");
      // $log.debug("error:", error);
      // $log.debug("res:", res);
      if (error)
        $scope.isFullnodeDownloaded = false;
      else {
        $scope.downloadanonlog = res;
        $scope.isFullnodeDownloaded = true;
      }
      configChange();
      $scope.$apply();
    });
  }

  $scope.startAnonCore = function () {
    $scope.startingAnonCore = true;
    $scope.stoplog = "";
    setupFullnode.callAnonCore("start", function (err, res) {
      // $log.debug("inside startNode")
      // $log.debug("res:")
      // $log.debug(res)
      // $log.debug("err:")
      // $log.debug(err)
      if (err) {
        $rootScope.isAnonCoreON = false;
        $scope.startlog = "Coudn't start the node, perhaps already running?";
      } else if(res) {
        $log.debug("Successfully started...")
        $scope.startlog = "Successfully started..."
        $rootScope.isAnonCoreON = true;
      }
      $scope.startingAnonCore = false;
      $scope.$apply();
    });
  }

  $scope.stopAnonCore = function () {
    $scope.stoppingAnonCore = true;
    $scope.startlog = "";
    setupFullnode.callAnonCore("stop", function (err, res) {
      // $log.debug("inside stopNode")
      // $log.debug("res:")
      // $log.debug(res)
      // $log.debug("err:")
      // $log.debug(err)
      if (err) {
        $rootScope.isAnonCoreON = false;
        $scope.stoplog = "Coudn't stop the node, perhaps already stopped?";
      } else if(res) {
        $log.debug("Successfully stopped...")
        $scope.stoplog = "Successfully stopped..."
        $rootScope.isAnonCoreON = false;
      }
      $scope.stoppingAnonCore = false;
      $scope.$apply();
    });
  }

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    readConfig();
    $scope.networkStats = fetchNetworkStats();
    // $scope.isFullnodeDownloaded = false;
    $scope.installationStarted = false;
    // $scope.startingAnonCore = false;
  });


});
