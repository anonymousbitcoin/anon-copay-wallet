'use strict';

angular.module('copayApp.controllers').controller('setupFullnodeController', function ($scope, $rootScope, $log, $timeout, $interval, rpcService, configService, platformInfo, setupFullnode, networkStatsService) {

  // store the interval promise in this variable
  var promiseLocalStats;
  var promiseNetStats;
  // stores 'getinfo' data
  $scope.localRPCInfo = [];

  // starts the interval
  $scope.startRPCInterval = function () {
    // stops any running interval to avoid two intervals running at the same time
    $scope.stopRPCInterval();

    //no need to start the interval is anon core went OFF.
    if($scope.isAnonCoreON){
      // store the interval promise
      promiseNetStats = $interval(fetchNetworkStats, 30000);
      promiseLocalStats = $interval(fetchLocalRPCInfo, 1000);
    }
  };

  // stops the interval
  $scope.stopRPCInterval = function () {
    $interval.cancel(promiseNetStats);
    $interval.cancel(promiseLocalStats);
  };

  // starting the interval by default
  $scope.startRPCInterval();

  // stops the interval when the scope is destroyed,
  // this usually happens when a route is changed and 
  // the setupFullnodeController $scope gets destroyed. The
  // destruction of the setupFullnodeController scope does not
  // guarantee the stopping of any intervals, you must
  // be responsible for stopping it when the scope is
  // is destroyed.
  $scope.$on('$destroy', function () {
    $scope.stopRPCInterval();
  });

  //currently not using
  // var readConfig = function () {
  //   var config = configService.getSync();
  //   $rootScope.isFullnodeDownloaded = config.wallet.isFullnodeDownloaded;
  // };

  var fetchNetworkStats = function () {
    // return cb(networkStatsService.getInfo());
    networkStatsService.getInfo(function (data) {
      $log.debug("Here is the explorer stats: ", data)
      $scope.networkStats = data;
    });
  };

  var fetchLocalRPCInfo = function () {
    //only run when we know that anon core is ON
    if ($scope.isAnonCoreON) {
      setupFullnode.localRPCGetinfo(function (res) {
        $scope.localRPCInfo = res;
        $log.debug("Here is the local daemon stats from setupFullnode controller", res)
      });
    }
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
      if (err) {
        $log.debug("Error: setupFullnode->downloadAnonCore - ", err)
        $rootScope.isFullnodeDownloaded = false;
      } else {
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
      } else if (res) {
        $log.debug("Successfully started...")
        $scope.startlog = "Successfully started..."
        //delay a call to rpc after starting a fullnode because it may not be ready (3 sec)
        $timeout(function () {
          $rootScope.isAnonCoreON = true;
          $scope.startingAnonCore = false;
          $scope.$apply();
          $scope.startRPCInterval();
          fetchNetworkStats();
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
      } else if (res) {
        $log.debug("Successfully stopped...")
        $scope.stoplog = "Successfully stopped..."
      }
      $rootScope.isAnonCoreON = false;
      $scope.stoppingAnonCore = false;
      $scope.$apply();
      $scope.stopRPCInterval();
    });
  }

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;

    //find out from anon explorer what is the currrent block height in the network
    
    //fetch only when local node is ON
    if ($rootScope.isAnonCoreON){
      fetchNetworkStats();
      $scope.startRPCInterval();
    }
    // $scope.startingAnonCore = false;
  });
});
