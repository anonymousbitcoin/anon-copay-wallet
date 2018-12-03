'use strict';

angular.module('copayApp.services').service('networkStatsService', function($http, $log, bitcoreAnon, storageService, lodash, profileService) {
    
    // this.getInfo = function(cb) {
    //     const https = require('https');
    //     https.get('https://explorer.anonfork.io/insight-api-anon/status?q=getinfo', (res) => {
    //         let data = []
    //         // A chunk of data has been recieved.
    //         res.on('data', (chunk) => {
    //             data += chunk;
    //         });
    
    //         // The whole response has been received. Print out the result.
    //         res.on('end', () => {
    //             console.log("Here are the network stats from networkStatsService:", data);
    //             return cb(data);
    //         });
    //     });
    // };

    this.getInfo = function(cb) {
        $http.get('https://explorer.anonfork.io/insight-api-anon/status?q=getinfo')
            .success(function(data, status) {
                console.log(data)
                console.log("network blocks", data.info.blocks)
                console.log("Success status getinfo", status)
                return cb(data);
            })
            .error(function (data, status, header, config) {
                console.log("Error status getinfo",status)
                return cb(data, status)
              });
    };




});   


