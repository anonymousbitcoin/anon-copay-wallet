'use strict';

angular.module('copayApp.services').service('setupFullnode', function ($log) {
  var path = process.env['HOME'] + "/Library/Application\ Support/AnonCopayFullnode";
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

  //start stop anon core
  this.callAnonCore = function (cmd, cb) {

    var anon_binary;
    if (cmd == "stop")
      anon_binary = "anon-cli";
    else if (cmd == "start") {
      anon_binary = "anond";
      cmd = "-daemon";
    } else
      return cb("Command not supported");

    var execute = function (command, callback) {

      var spawn = require('child_process').spawn,
      ex    = spawn('sudo', [path + "/" + anon_binary, command]);
      
      ex.on('error', function(err) {
        return callback(err.toString(), null, null);
      });
      ex.stdout.on('data', function (stdout) {
        return callback(null, stdout.toString(), null);
      });

      ex.stderr.on('data', function (stderr) {
        return callback(null, null, stderr.toString());
      });
    };

    execute(cmd, function (error, stdout, stderr){
      // $log.debug("calling anond or anon-cli done");
      // $log.debug("error:", error);
      // $log.debug("stdout:", stdout);
      // $log.debug("stderr:", stderr);
      if (error)
          return cb(error);
      else if (stderr)
          return cb(stderr);
        return cb(null, stdout);
    })
    
  };

});
