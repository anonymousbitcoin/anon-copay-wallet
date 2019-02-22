'use strict';

angular.module('copayApp.controllers').controller('addNewNodeController', function ($scope, $state, $rootScope, $log, $timeout, $interval, configService, platformInfo, setupFullnode, networkStatsService, gettextCatalog, popupService, storageService, lodash) {

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
    $rootScope.path_to_executables = elem.files[0].path;
    $scope.$apply();
        
        setupFullnode.checkIfAnonExecFilesExistService(true, function (err) {
          if (err) {
            $rootScope.isFullnodeDownloaded = false;
            $log.debug("Error: Anon core doesn't exist - ", err)
            popupService.showAlert("Error", "Couldn't locate anond or anon-cli. <br>Choose a correct folder.", function(){
            })
          } else {
            $rootScope.isFullnodeDownloaded = true;
            $log.debug("Anon core has been located");
    
            var opts = {
              inputType: 'text',
              forceHTMLPrompt: true,
              class: 'text-warn'
            };
            popupService.showPrompt("Anon executables have been located.", "Choose a name for your node", opts, function(res){
              if(res){
                $scope.fullnodeListObject = {"name": res ,"anonCoreFullPath": $rootScope.fullPath, "default": false };
                $scope.selectedFullnodeList.name = res;
              }
              else  
                $scope.fullnodeListObject = {"name": 'Nameless',"anonCoreFullPath": $rootScope.fullPath, "default": false }
                $rootScope.path_to_executables = $rootScope.fullPath;
              if($rootScope.fullnodeList) {
                $rootScope.fullnodeList.forEach((element, ix) => {
                  if (element.selected) {
                    $rootScope.fullnodeList[ix].selected = false;
                  }
                });
              }
              $scope.fullnodeListObject.selected = true;
              
              // popupService.showConfirm("Choose Datadir", "This is a folder where Anon Fullnode stores blocks.", "Choose", "Keep Default", function(res) {
              // // popupService.showPrompt("Choose Datadir", "This is a folder where Anon Fullnode stores blocks.", null, function(res){
              //   $scope.chooseDirectoryPath = true;
              //   $timeout(() => {
              //     angular.element(document.querySelector("#choose_directory")).triggerHandler("click");
              //   })
              //   if(res)
              //     $rootScope.fullnodeList.push({"anonCoreDatadir": $rootScope.fullPath })
              //   else  
              //     $rootScope.fullnodeList.push({"anonCoreDatadir": $rootScope.fullPath })
    
              //     UpdateConfigFullnodeList();
              //   })
              })  
            }
          });
              
            }

    
    $scope.chooseDirectory = (elem) => {
      setupFullnode.checkIfAnonExecFilesExistService(true, function (err) {
        $scope.fullnodeListObject.anonCoreDatadir = elem.files[0].path;
        $rootScope.path_to_datadir = elem.files[0].path;
        if($rootScope.fullnodeList) {
          $rootScope.fullnodeList.forEach((element, ix) => {
            if (element.selected) {
              $rootScope.fullnodeList[ix].selected = false;
            }
          });
        }
        $scope.fullnodeListObject.selected = true;

        
        createFullNodeList($scope.fullnodeListObject)
        // popupService.showConfirm("Choose Datadir", "This is a folder where Anon Fullnode stores blocks.", "Choose", "Keep Default", function(res) {
        //   // popupService.showPrompt("Choose Datadir", "This is a folder where Anon Fullnode stores blocks.", null, function(res){
        //     $scope.chooseDirectoryPath = true;
        //     $timeout(() => {
        //       angular.element(document.querySelector("#choose_directory")).triggerHandler("click");
        //     })
        //     if(res)
        //       $rootScope.fullnodeList.push({"anonCoreDatadir": $rootScope.fullPath })
        //     else  
        //       $rootScope.fullnodeList.push({"anonCoreDatadir": $rootScope.fullPath })

        //     })
            UpdateConfigFullnodeList();
        $scope.$apply();
        $state.go('tabs.setupfullnode');
    })
  }

  $scope.installDefault = () => {
    // setupFullnode.setupOSPath((err, response) => {
      // if(!err) {
        createFullNodeList({ "name": "Default" ,"anonCoreFullPath": $rootScope.anonCoreFullPath, "anonCoreDatadir": $rootScope.anonCoreDatadir, default: true})
        // $scope.$apply();
        $scope.selectedFullnodeList.name = "Default";
        $state.go('tabs.setupfullnode');
      // }
      storageService.getFullNodeList(function(err, result){
      })

    // });
  }
  var createFullNodeList = function(fullNodeList, cb) {
    $log.info('Creating FullNodeList');
    var defaults = configService.getDefaults();

    configService.get(function(err) {
      if (err) $log.debug(err);

      var p = FullNodeList.create(fullNodeList);
      console.log("EVERYBODY SAY FUCK", p, fullNodeList)
      storageService.storeNewFullNodeList(p, function(err) {
        // if (err) return cb(err);
        // root.bindProfile(p, function(err) {
        //   // ignore NONAGREEDDISCLAIMER
        //   if (err && err.toString().match('NONAGREEDDISCLAIMER')) return cb();
        //   return cb(err);
        // });
      });
    });
  };

  var readConfigFullnodeList = function () {
    var config = configService.getSync();
    // $rootScope.fullnodeList = config.wallet.fullnodeList.slice() || [];
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
    $scope.selectedFullnodeList = {}
    // setupFullnode.setupOSPath((err, response) => {
    //   if(err) {
    //   }
    //   storageService.getFullNodeList(function(err, result){
    //   })
    // })
    $scope.defaultExists = false
    if($rootScope.fullnodeList) {
      $rootScope.fullnodeList.forEach((val, ix) => {
        // if(val.default)
          // $scope.defaultExists = true
      })
    }
  });

});
