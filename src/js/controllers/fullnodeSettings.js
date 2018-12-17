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
        $log.debug("Error: Anon core doesn't exist - ", err)
      } else {
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
        $rootScope.RPCusername = res.rpcuser.data;
        $rootScope.RPCpassword = res.rpcpassword.data;
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
    $log.debug("which OS: ", platformInfo.OS);
    
    if ($rootScope.isFullnodeMode){
      setupAnonConf();
      setupFullnode.checkIfAnonFullnodeONService();
      checkIfAnonExecFilesExist();    
    }
  });

});
