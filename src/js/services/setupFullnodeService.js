'use strict';

angular.module('copayApp.services').service('setupFullnode', function ($log, $http, $rootScope) {
  var path = process.env['HOME'] + "/AnonCopayFullnode";
  var link_anond = "https://assets.anonfork.io/osx/anond";
  var link_anoncli = "https://assets.anonfork.io/osx/anon-cli"

  //download anond and anon-cli executables
  this.downloadAnonService = function (cb) {
    var exec = require('child_process').exec;
    var fs = require('fs'),
      request = require('request');

    var download = function (uri, filename, callback) {

      //retrieve the file
      request.head(uri, function (err, res, body) {

        $log.debug("done downloading the file");
        if (err)
          return cb(err)

        //create folder if it doesn't exist
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }

        //save the file
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
      });
    };

    //deal with permission issues on unix
    var fixPermissions = function (callback) {
      exec("chmod a+x " + path + '/anond' + " " + path + '/anon-cli', callback);
    }

    var fetchZcashParams = function (callback) {
      $log.debug("Fetching Zcash Param Keys...")
      exec("curl -s https://raw.githubusercontent.com/anonymousbitcoin/anon/master/anonutil/fetch-params.sh | bash", callback);
    }

    //TODO: ADD WINDOWS SUPPORT

    //first download and save anond binary
    download(link_anond, path + '/anond', function () {
      $log.debug("done writing file anond");
      //second download and save anon-cli binary
      download(link_anoncli, path + '/anon-cli', function () {
        $log.debug("done writing file anon-cli");
        //third fetch zcash param keys (for now unix only)
        fetchZcashParams(function (error, stdout, stderr) {
          $log.debug("error:", error);
          $log.debug("stdout:", stdout);
          $log.debug("stderr:", stderr);
          //forth fix permissions for these files (unix only) 
          fixPermissions(function () {
            return cb(null, "Anon full node executables have been succesfully downloaded")
          })
        })
      });
    });
  };

  //start-stop anon core
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

      var spawn = require('child_process').spawn;
      $log.debug("PATH-TEST", (path + "/" + anon_binary));
      $log.debug("command", command);

      var ex = spawn(path + '/' + anon_binary, [command]);

      //create listeners
      ex.once('error', function (err) {
        // ex.removeListener('error', callback(err.toString(), null, null));
        return callback(err.toString(), null, null);
      });
      ex.stdout.once('data', function (stdout) {
        // ex.removeListener('data', callback(null, stdout.toString(), null));
        return callback(null, stdout.toString(), null);
      });

      ex.stderr.once('stderr', function (stderr) {
        // ex.removeListener('stderr', callback(null, null, stderr.toString()));
        return callback(null, null, stderr.toString());
      });
    };

    execute(cmd, function (error, stdout, stderr) {
      $log.debug("calling anond or anon-cli done");
      $log.debug("error:", error);
      $log.debug("stdout:", stdout);
      $log.debug("stderr:", stderr);
      if (error)
        return cb(error);
      else if (stderr)
        return cb(stderr);
      return cb(null, stdout);
    })

  };

  //call rpc and find out if Anon Core is ON.

  this.checkIfAnonFullnodeONService = function () {

    var isAnonON = function (cb) {
      // use $.param jQuery function to serialize data from JSON 
      var data = {
        "method": "getinfo"
      };
      var config = {
        headers: {
          'Content-Type': 'application/json'
        }
      }
      $http.defaults.headers.common.Authorization = 'Basic ' + btoa('user:password');
      $http.post('http://localhost:3130', data, config)
        .success(function (data, status, headers, config) {
          // $scope.PostDataResponse = data;
          // $log.debug(data.result);
          // $log.debug("status:", status);
          return cb(data, status)
        })
        .error(function (data, status, header, config) {
          // $log.debug(data);
          // $log.debug("status:", status);
          // $log.debug(header);
          // $log.debug(config);
          return cb(data, status)
        });
    }

    isAnonON(function (data, status) {
      $log.debug("data: ", data);
      $log.debug("status: ", status);
      if (status && status === 200)
        $rootScope.isAnonCoreON = true;
      else
        $rootScope.isAnonCoreON = false;
    });
  };

});
