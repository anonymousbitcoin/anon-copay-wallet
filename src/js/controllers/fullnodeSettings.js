'use strict';

angular.module('copayApp.controllers').controller('fullnodeSettingsController', function ($scope, $rootScope, $log, configService, platformInfo, setupFullnode) {

  var readConfig = function () {
    var config = configService.getSync();
    $rootScope.isFullnodeMode = config.wallet.isFullnodeMode;
  };

  var checkIfAnonExecFilesExist = function(){
    setupFullnode.checkIfAnonExecFilesExistService(function (err) {
      if (err) {
        $rootScope.isFullnodeDownloaded = false;
        console.log("IT IS NOT INSTALLED")
        $log.debug("Error: Anon core doesn't exist - ", err)
      } else {
        console.log("IT IS INSTALLED")
        $rootScope.isFullnodeDownloaded = true;
        $log.debug("Anon core has been located");
      }
    });
  }

  var setupAnonConf = function(){
    setupFullnode.setupAnonConfService(function (err, res) {
      if (err) {
        $log.debug("Error: setupAnonConf - ", err)
      } else {
        $log.debug("Res: setupAnonConf - ", res)
      }
    });
  }

  $scope.fullNodeChange = function () {
    $rootScope.isFullnodeMode = $rootScope.isFullnodeMode ? false : true;
    if ($rootScope.isFullnodeMode){
      setupFullnode.checkIfAnonFullnodeONService();
      checkIfAnonExecFilesExist(); 
    }
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
    
    if ($rootScope.isFullnodeMode){
      console.log("IS FULL NODE MODE");
      setupAnonConf();
      console.log("12 STEPS")
      setupFullnode.checkIfAnonFullnodeONService();
      console.log("JBREKKIE")
      checkIfAnonExecFilesExist();    
      console.log("CHECK CHECK")
    }
  });

});
