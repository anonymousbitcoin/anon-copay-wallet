'use strict';

angular.module('copayApp.services').service('setupFullnode', function ($log) {
  var path = process.env['HOME'] + "/AnonCopayFullnode";
  var link_anond = "https://assets.anonfork.io/osx/anond";
  var link_anoncli = "https://assets.anonfork.io/osx/anon-cli"

  //download anond and anon-cli executables
  this.downloadAnon = function (cb) {

    var fs = require('fs'),
      request = require('request');

    var download = function (uri, filename, callback) {
      request.head(uri, function (err, res, body) {

        $log.debug("done downloading the file");
        if (err)
          return cb(err)

        //create folder if it doesn't exist
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }

        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
    };

    download(link_anond, path + '/anond', function () {
      $log.debug("done writing file anond");
      download(link_anoncli, path + '/anon-cli', function () {
        $log.debug("done writing file anon-cli");
      });
      return cb(null, "completeddsdss")
    });
  };
});
