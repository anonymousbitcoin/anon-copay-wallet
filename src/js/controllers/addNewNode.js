'use strict';

angular.module('copayApp.controllers').controller('addNewNodeController', function ($scope, $state, $rootScope, $log, $timeout, $interval, configService, platformInfo, setupFullnode, networkStatsService, gettextCatalog, popupService) {

  // stores 'getinfo' data
  $scope.localRPCInfo = [];
  $scope.downloadAnon = true;

  $scope.customDownload = false
  $scope.autoDownload = false;
  $scope.step1_1 = false;
  $scope.step1_2 = false;
  $rootScope.fullPath = "";


  // retrieve full path from "choose folder" input
  $scope.getPath = function (elem) {
    $rootScope.fullPath = elem.files[0].path;
    console.log("path is: ", $rootScope.fullPath)
    $scope.$apply();

    setupFullnode.checkIfAnonExecFilesExistService(true, function (err) {
      if (err) {
        $rootScope.isFullnodeDownloaded = false;
        $log.debug("Error: Anon core doesn't exist - ", err)
        popupService.showAlert("Error", "Couldn't locate anond or anon-cli. <br>Choose a correct folder.", function(){
          console.log("do nothing here")
        })
      } else {
        $rootScope.isFullnodeDownloaded = true;
        $log.debug("Anon core has been located");

        var opts = {
          inputType: 'text',
          forceHTMLPrompt: true,
          class: 'text-warn'
        };
        console.log("List before prompt: ", $rootScope.fullnodeList)
        popupService.showPrompt("Anon executables have been located.", "Choose a name for your node", opts, function(res){
          console.log("continue")
          console.log("res: ", res)
          $rootScope.fullnodeList = [];
          if(res)
            $rootScope.fullnodeList[0] = { "name": res ,"anonCoreFullPath": $rootScope.fullPath } 
          else  
            $rootScope.fullnodeList[0] = { "name": 'Nameless',"anonCoreFullPath": $rootScope.fullPath } 
          
          popupService.showConfirm("Choose Datadir", "This is a folder where Anon Fullnode stores blocks.", "Choose", "Keep Default", function(res) {
          // popupService.showPrompt("Choose Datadir", "This is a folder where Anon Fullnode stores blocks.", null, function(res){
            console.log("inside Choose Datadir")
            if(res)
              $rootScope.fullnodeList[0] = {"anonCoreDatadir": $rootScope.fullPath } 
            else  
              $rootScope.fullnodeList[0] = {"anonCoreDatadir": $rootScope.fullPath } 
              UpdateConfigFullnodeList();
              console.log("List after prompt: ", $rootScope.fullnodeList)
              $state.go('tabs.setupfullnode');
          })
        })  
      }
    });

  }

  var readConfigFullnodeList = function () {
    var config = configService.getSync();
    $rootScope.fullnodeList = config.wallet.fullnodeList.slice() || [];
    setupFullnode.updatePath();
  };

  var UpdateConfigFullnodeList = function () {
    var opts = {
      wallet: {
        fullnodeList: $rootScope.fullnodeList
      }
    };
    configService.set(opts, function (err) {
      if (err) $log.debug(err);
    });
    setupFullnode.updatePath();
  };
  

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    readConfigFullnodeList();
  });

});
