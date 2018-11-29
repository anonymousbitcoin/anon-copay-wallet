'use strict';

angular.module('copayApp.services').service('networkStatsService', function($log, bitcoreAnon, storageService, lodash, profileService) {
    
    // var root = {};
    
    this.getInfo = function(cb) {
        var https = require('https');
            https.get('https://explorer.anonfork.io/insight-api-anon/status?q=getinfo', function(err, res) {
                if(err){
                    return error(error, "There's been an error")
                }
                else{
                    console.log(res)
                    return cb(res)
                }
            });
        };
});   


