'use strict';

angular.module('copayApp.services').factory('networkStatsService', function($window, $http) {
  var ret = {

  };
  ret.getInfo = (cb) => {
    // use $.param jQuery function to serialize data from JSON 
     let data = {
         "method": "getinfo"
     };
    //  test.writeToClipboard("some  daata");
    //  test.downloadAnonCore("https://github.com/anonymousbitcoin/anon/releases/download/v1.3.0/Anon-full-node-v.1.3.0-win-64.zip");
    // $scope.errorlog = test.downloadAnonCore("https://assets.anonfork.io/osx/anond");
     let config = {
         headers : {
             'Content-Type': 'application/json'

         }
     }
    //  
    $http.defaults.headers.common.Authorization = 'Basic ' + btoa($rootScope.RPCusername + ":" + $rootScope.RPCpassword);
     
     $http.post('http://localhost:3130', data, config)
     .success(function (data, status, headers, config) {
        //  $scope.PostDataResponse = data;
         return cb(data.result);
          // return root.getZAddressesBalances(cb, data.result);
     })
     .error(function (data, status, header, config) {
        return data;
        // return cb(["Error", data]);
        //  $scope.ResponseDetails = "Data: " + data +
        //      "<hr />status: " + status +
        //      "<hr />headers: " + header +
        //      "<hr />config: " + config;
     });
 };

 return ret;
});
