'use strict';

angular.module('copayApp.services').factory('networkStatsService', function($log, bitcoreAnon, storageService, lodash, profileService) {
  var root = {};
  root.getInfo = function(cb) {
    let result = []
    fetch("https://explorer.anonfork.io/insight-api-anon/status?q=getinfo", 
        { headers: 
            { "Content-Type": 
                "application/json; 
                charset=utf-8" 
            }
        })
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then(response => {
      result = response
        // here you do what you want with response
        return cb(null, result);
    })
    .catch(err => {
        console.log("sorry, there are no results for your search")
	});
    return root;
    };
})   
;

