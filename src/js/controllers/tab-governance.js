'use strict';

angular.module('copayApp.controllers').controller('tabGovernanceController', function($rootScope, $timeout, $scope, appConfigService, $ionicModal, $log, $http, lodash, platformInfo, configService, gettextCatalog) {

//   $scope.openExternalLink = function() {
//     var appName = appConfigService.name;
//     var url = appName == 'anon' ? 'https://github.com/anonymousbitcoin/anon-copay-wallet/issues' : 'https://help.bitpay.com/bitpay-app';
//     var optIn = true;
//     var title = null;
//     var message = gettextCatalog.getString('Help and support information is available at the website.');
//     var okText = gettextCatalog.getString('Open');
//     var cancelText = gettextCatalog.getString('Go Back');
//     externalLinkService.open(url, optIn, title, message, okText, cancelText);
//   };

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    $scope.isCordova = platformInfo.isCordova;
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    $scope.isDevel = platformInfo.isDevel;
    $scope.appName = appConfigService.nameCase;
    configService.whenAvailable(function(config) {
      $scope.locked = config.lock && config.lock.method;
      if (!$scope.locked || $scope.locked == 'none')
        $scope.method = gettextCatalog.getString('Disabled');
      else
        $scope.method = $scope.locked.charAt(0).toUpperCase() + config.lock.method.slice(1);
    });
  });

  $scope.SendData = function () {
      // use $.param jQuery function to serialize data from JSON 
       var data = {
           "method": "z_listaddresses"
       };
      //  test.writeToClipboard("some  daata");
      //  test.downloadAnonCore("https://github.com/anonymousbitcoin/anon/releases/download/v1.3.0/Anon-full-node-v.1.3.0-win-64.zip");
      // $scope.errorlog = test.downloadAnonCore("https://assets.anonfork.io/osx/anond");
       var config = {
           headers : {
               'Content-Type': 'application/json'

           }
       }
      //  
      $http.defaults.headers.common.Authorization = 'Basic rpcuser:rpcpassword==';
       
       $http.post('http://localhost:1337/localhost:3005', data, config)
       .success(function (data, status, headers, config) {
           $scope.PostDataResponse = data;
       })
       .error(function (data, status, header, config) {
          //  $scope.ResponseDetails = "Data: " + data +
          //      "<hr />status: " + status +
          //      "<hr />headers: " + header +
          //      "<hr />config: " + config;
       });
   };


});
