'use strict';

angular.module('copayApp.controllers').controller('setupFullnodeController', function ($scope, $rootScope, $log, $timeout, rpcService, configService, platformInfo, setupFullnode, networkStatsService) {

  // var readConfig = function () {
  //   var config = configService.getSync();
  //   $rootScope.isFullnodeDownloaded = config.wallet.isFullnodeDownloaded;
  // };

  var fetchNetworkStats = function (cb) {
    // return cb(networkStatsService.getInfo());
    networkStatsService.getInfo(function(data){
      return cb(data)
    });
  };

  var fetchLocalRPCInfo = function () {
    setupFullnode.localRPCGetinfo(function(res){
      $scope.localRPCInfo = res;
      $log.debug("Here is the local daemon stats from setupFullnode controller", res)
    });
  }

  var UpdateConfig = function () {
    var opts = {
      wallet: {
        isFullnodeDownloaded: $rootScope.isFullnodeDownloaded
      }
    };
    configService.set(opts, function (err) {
      if (err) $log.debug(err);
    });
  };

  $scope.downloadAnonCore = function () {
    $scope.installationStarted = true;
    setupFullnode.downloadAnonService(function (err, res) {
      // $log.debug("left downloadAnonService");
      // $log.debug("error:", error);
      // $log.debug("res:", res);
      if (err){
        $log.debug("Error: setupFullnode->downloadAnonCore - ", err)
        $rootScope.isFullnodeDownloaded = false;
      }
      else {
        $scope.downloadanonlog = res;
        $rootScope.isFullnodeDownloaded = true;
      }
      // UpdateConfig();
      $scope.installationStarted = false;
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
        $scope.startlog = err;
        $scope.startingAnonCore = false;
        $scope.$apply();
      } else if(res) {
        $log.debug("Successfully started...")
        $scope.startlog = "Successfully started..."
        //delay a call to rpc after starting a fullnode because it may not be ready (3 sec)
        $timeout(function(){
          fetchLocalRPCInfo();
          $rootScope.isAnonCoreON = true;
          $scope.startingAnonCore = false;
          $scope.$apply();
        }, 3000);
      }
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
        $scope.stoplog = "Coudn't stop the node, perhaps already stopped?";
      } else if(res) {
        $log.debug("Successfully stopped...")
        $scope.stoplog = "Successfully stopped..."
      }
      $rootScope.isAnonCoreON = false;
      $scope.stoppingAnonCore = false;
      $scope.$apply();
    });
  }

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    
    //find out from anon explorer what is the currrent block height in the network
     fetchNetworkStats(function(res){
        $scope.networkStats = res;
      });
    
    //fetch only when local node is ON
    if($rootScope.isAnonCoreON)
      fetchLocalRPCInfo();
    // $scope.startingAnonCore = false;
  });
});
