'use strict';

angular.module('copayApp.services').factory('governanceProposalService', function($log, bitcoreAnon, storageService, lodash, profileService) {
  var root = {};

  var getNetwork = function(address) {
    var network;
    network = (new bitcoreAnon.Address(address)).network.name;
    return network;
  };

//   root.get = function(addr, cb) {
//     storageService.getAddressbook('testnet', function(err, ab) {
//       if (err) return cb(err);
//       if (ab) ab = JSON.parse(ab);
//       if (ab && ab[addr]) return cb(null, ab[addr]);

//       storageService.getAddressbook('livenet', function(err, ab) {
//         if (err) return cb(err);
//         if (ab) ab = JSON.parse(ab);
//         if (ab && ab[addr]) return cb(null, ab[addr]);
//         return cb();
//       });
//     });
//   };

  root.list = function(cb) {
    let proposals = []
    fetch("http://127.0.0.1:3232/bws/api/v2/proposals/", { headers: { "Content-Type": "application/json; charset=utf-8" }})
    .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
    .then(response => {
      proposals = response.gobjects;
        // here you do what you want with response
        return cb(null, proposals);
    })
    .catch(err => {
        console.log("u")
        console.log("sorry, there are no results for your search")
    });

    
    // profileService.getProposals(function(err, proposals) {
    //     console.log("wher ame i?")
    //   if (err) return cb('Could not get the Proposals');

    //   if (proposals) proposals = JSON.parse(proposals);
    //     return cb(err, lodash.defaults(proposals));
    // });
  };

//   root.add = function(entry, cb) {
//     var network = getNetwork(entry.address);
//     if (lodash.isEmpty(network)) return cb('Not valid ANON Address');
//     storageService.getAddressbook(network, function(err, ab) {
//       if (err) return cb(err);
//       if (ab) ab = JSON.parse(ab);
//       ab = ab || {};
//       if (lodash.isArray(ab)) ab = {}; // No array
//       if (ab[entry.address]) return cb('Entry already exist');
//       ab[entry.address] = entry;
//       storageService.setAddressbook(network, JSON.stringify(ab), function(err, ab) {
//         if (err) return cb('Error adding new entry');
//         root.list(function(err, ab) {
//           return cb(err, ab);
//         });
//       });
//     });
//   };

//   root.remove = function(addr, cb) {
//     var network = getNetwork(addr);
//     if (lodash.isEmpty(network)) return cb('Not valid ANON Address');
//     storageService.getAddressbook(network, function(err, ab) {
//       if (err) return cb(err);
//       if (ab) ab = JSON.parse(ab);
//       ab = ab || {};
//       if (lodash.isEmpty(ab)) return cb('Addressbook is empty');
//       if (!ab[addr]) return cb('Entry does not exist');
//       delete ab[addr];
//       storageService.setAddressbook(network, JSON.stringify(ab), function(err) {
//         if (err) return cb('Error deleting entry');
//         root.list(function(err, ab) {
//           return cb(err, ab);
//         });
//       });
//     });
//   };

//   root.removeAll = function() {
//     storageService.removeAddressbook('livenet', function(err) {
//       storageService.removeAddressbook('testnet', function(err) {
//         if (err) return cb('Error deleting addressbook');
//         return cb();
//       });
//     });
//   };

  return root;
});
