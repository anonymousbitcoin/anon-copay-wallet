'use strict';

angular.module('copayApp.controllers').controller('fullnodeSettingsController', function ($scope, $rootScope, $log, configService, platformInfo, setupFullnode, storageService, $state) {

  var readConfig = function () {
    var config = configService.getSync();
    $rootScope.isFullnodeMode = config.wallet.isFullnodeMode;
  };

  var checkIfAnonExecFilesExist = function(){
    setupFullnode.checkIfAnonExecFilesExistService(null, function (err) {
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
      // setupFullnode.setupOSPath((err, response) => {
      //   if(err) {
      //   }
        storageService.getFullNodeList(function(err, result){
          console.log("MOREE YOU WANT MORE", result)
          if(result)
            $rootScope.fullnodeList = JSON.parse(result);
           else 
            $rootScope.fullnodeList = [];
          
        })
      // })
    }
  });

  $scope.goToSetup = (fullnode) => {
    $rootScope.anonCoreDatadir = fullnode.anonCoreDatadir;
    $rootScope.anonCoreFullPath = fullnode.anonCoreFullPath

    $rootScope.path_to_datadir = fullnode.anonCoreDatadir;
    $rootScope.path_to_executables = fullnode.anonCoreFullPath
    $state.go('tabs.setupfullnode');
  }

});
