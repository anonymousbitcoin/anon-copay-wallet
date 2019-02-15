'use strict';

angular.module('copayApp.services').service('setupFullnode', function ($log, $http, $rootScope, platformInfo) {

  const homedir = require('os').homedir();

  //os specific path
  $rootScope.path_to_executables;
  $rootScope.path_to_datadir;
  var path_to_zcashparams;
  //slash difference between win and unix os
  var slash;

  //os specific link for fullnode executables
  var download_anond_link;
  var download_anoncli_link;
  var download_zparams_proving_key_win;
  var download_zparams_verifying_key_win;

  //executables name
  var anond;
  var anon_cli;

  $log.debug("homedir: ", homedir);

  var newHomeDir = homedir.split('\\')[1];

  $log.debug('newHOMEDIR:', newHomeDir);

  this.setupOSPath = function(cb) {
    //setup windows path
    if (platformInfo.OS === "Win") {
      console.log("::::::::::::((((((((((((((((", homedir)
      $rootScope.path_to_executables = "" + homedir + "'\\AppData\\Roaming\\AnonCopayFullnode'";
      $rootScope.path_to_datadir = "'" + homedir + "\\AppData\\Roaming\\Anon'";
      path_to_zcashparams = "'" + homedir + "\\AppData\\Roaming\\ZcashParams'";
      slash = "\\";
      download_anond_link = "https://assets.anonfork.io/win64/anond.exe";
      download_anoncli_link = "https://assets.anonfork.io/win64/anon-cli.exe";
      download_zparams_proving_key_win = "https://assets.anonfork.io/sprout-proving.key"
      download_zparams_verifying_key_win = "https://assets.anonfork.io/sprout-verifying.key"
      anond = "anond.exe";
      anon_cli = "anon-cli.exe"
      $rootScope.isOSsupported = true;
      // this.downloadAnonService(cb)
      //setup macos path
    } else if (platformInfo.OS === "Mac") {
      $rootScope.path_to_executables = homedir + "/AnonCopayFullnode";
      $rootScope.path_to_datadir = homedir + "'/Library/Application Support/Anon'";
      path_to_zcashparams = homedir + "/Library/Application Support/ZcashParams"
      slash = "/";
      download_anond_link = "https://assets.anonfork.io/osx/anond";
      download_anoncli_link = "https://assets.anonfork.io/osx/anon-cli";
      anond = "anond";
      anon_cli = "anon-cli";
      $rootScope.isOSsupported = true;
    }
    //this OS isn't supported
    else {
      $rootScope.isOSsupported = false;
    }
    if($rootScope.isOSsupported){
      $rootScope.anonCoreDatadir = $rootScope.path_to_datadir;
      $rootScope.anonCoreFullPath = $rootScope.path_to_executables;
      this.downloadAnonService(cb)

    }
    $log.debug("$rootScope.path_to_executables: ", $rootScope.path_to_executables);
    $log.debug("$rootScope.path_to_datadir: ", $rootScope.path_to_datadir);
    $log.debug("path_to_zcashparams: ", path_to_zcashparams);

  };

  // not the best way, needs to be refactored later
  this.updatePath = function(){
    // if($rootScope.fullnodeList.length){
    //   console.log("BEACH BOYS dklhnsdhnskjdnghjkdfgshnkjsd", $rootScope.fullnodeList)
    //   $rootScope.path_to_executables  = $rootScope.fullnodeList[0].anonCoreFullPath || $rootScope.path_to_executables;
    //   $rootScope.path_to_datadir  = $rootScope.fullnodeList[0].anonCoreDataDir || $rootScope.path_to_datadir; 
    // }
  }

  //for generating random password
  var crypto = require("crypto");

  //stores a list of "must have" settings
  var anon_conf_min_setup = {
    "rpcuser": {
      data: "anoncopayfullnode",
      exist: false
    },
    "rpcpassword": {
      data: crypto.randomBytes(20).toString('hex'),
      exist: false
    },
    "rpcallowip": {
      data: "127.0.0.1",
      exist: false
    },
    "rpcport": {
      data: "3130",
      exist: false
    },
    "txindex": {
      data: "1",
      exist: false
    }
  }

  //reset the list
  var reset_anon_conf_min_setup = function (data, cb) {
    data['rpcuser']['data'] = "anoncopayfullnode";
    data['rpcpassword']['data'] = crypto.randomBytes(20).toString('hex');

    for (var x in data) {
      data[x]['exist'] = false;
    }
  }

  //do we need to update anon.conf
  var isUpdateAnonConfRequired = function (data) {
    for (var x in data) {
      if (!data[x]['exist'])
        return true;
    }
    return false;
  }

  //checks if a file exist and can be read
  var isFileExist = function (file, callback) {
    var fs = require('fs');
    fs.access(file.toString().replace(/["']/g, ""), fs.constants.F_OK | fs.constants.R_OK, callback);
  }

  //checks if a file exist and can be read
  var ensureAnonFolderExist = function (path, callback) {
    var fs = require('fs');
    if (!fs.existsSync(path.replace(/["']/g, ""))) {
      console.log("WORLD TOWN", path.replace(/["']/g, ""))
      fs.mkdir(path, function (err) {
        if (err)
          return callback(err)
        return callback();
      });
    }
    return callback();
  }

  //create and write data to a file
  var writeToFile = function (file, data, cb) {
    var fs = require('fs');
    fs.writeFile(file, data, function (err) {
      if (err)
        return cb(err);
      return cb();
    });
  }

  //append data to an existing file
  var appendToFile = function (file, data, cb) {
    var fs = require('fs');
    var stream = fs.createWriteStream(file, {
      flags: 'a'
    });
    stream.write(data);

    stream.on('error', function (err) {
      return cb(err);
    })
    stream.on('finish', function () {
      return cb();
    })
  }

  //read a file
  var readFile = function (file, cb) {
    var fs = require('fs');
    fs.readFile(file.replace(/["']/g, ""), 'utf8', function (err, contents) {
      if (err)
        return cb(err);
      return cb(null, contents);
    });
  }

  //format data to be written to anon.conf
  var formatData = function (data) {
    var result = "";
    for (var key in data) {
      if (!data[key]['exist']) {
        result += key + "=" + data[key]['data'] + "\n";
      }
    }
    $log.debug("Res: formatData - ", result);
    return result;
  }

  //download anond and anon-cli executables
  this.downloadAnonService = function (cb) {
    $log.debug("relative path: ", process.cwd());
    var exec = require('child_process').exec;
    var fs = require('fs');

    var https = require('https');

    var download = (url, file, path_file_folder, finalCb, cb) => {
      //create folder if it doesn't exist
      console.log("XR2", path_file_folder)
      if (!fs.existsSync(path_file_folder.replace(/["']/g, "")))
        fs.mkdirSync(path_file_folder.replace(/["']/g, ""));

      var file = fs.createWriteStream(file);

      const request = https.get(url, (response) => {
        // check if response is success
        if (response.statusCode !== 200) {
          return cb('Response status was ' + response.statusCode, false);
        }

        response.pipe(file);
      });

      // close() is async, call cb after close completes
      file.on('finish', () => file.close(cb("", true)));

      // check for request error too
      request.on('error', (err) => {
        fs.unlink(file);
        return cb(err.message, false);
      });

      file.on('error', (err) => { // Handle errors
        fs.unlink(file); // Delete the file async. (But we don't check the result)
        return cb(err.message, false);
      });
    };
    //KEEP IT HERE FOR NOW, UNTIL FIGURE OUT WHY REQUEST DOESN"T WORK ON WINDOWS
    // var download = function (uri, filename, callback) {

    //   //retrieve the file
    //   request.head(uri, function (err, res, body) {

    //     $log.debug("done downloading the file");
    //     if (err)
    //       return cb(err)

    //     //create folder if it doesn't exist
    //     if (!fs.existsSync($rootScope.path_to_executables))
    //       fs.mkdirSync($rootScope.path_to_executables);

    //     //save the file
    //     request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    //   });
    // };

    //deal with permission issues on unix
    var fixPermissions = function (callback) {
      exec("chmod a+x " + $rootScope.path_to_executables + slash + anond + " " + $rootScope.path_to_executables + slash + anon_cli, callback);
    }

    //first download and save anond binary
    download(download_anond_link, $rootScope.path_to_executables + slash + anond, $rootScope.path_to_executables, cb, function (err) {
      if (err)
        return cb(err)
      $log.debug("done writing file anond");

      //second download and save anon-cli binary
      download(download_anoncli_link, $rootScope.path_to_executables + slash + anon_cli, $rootScope.path_to_executables, cb, function (err) {
        if (err)
          return cb(err)
        $log.debug("done writing file anon-cli");
         //fix permissions for these files (unix only)
        fixPermissions(function () {

        //third fetch zcash param keys (for now unix only)
        //on Windows
          if (platformInfo.OS === "Win") {
            fetchProvingKeyWin(function (err) {
              if (err)
                return cb(err)
              fetchVerifyingKeyWin(function (err) {
                if (err)
                  return cb(err)
                return cb(null, "Anon full node executables have been succesfully downloaded")
              })
            })

          //on Unix (macOS, linux, etc)
          } else {
            fetchZcashParamsUnix(function (error, res) {
              if (err)
                return cb(err);
              $log.debug("error:", error);
              $log.debug("res:", res);
              return cb(null, "Anon full node executables have been succesfully downloaded")
            })
          }
        })
      });
    });
  };

  var successfulInstall = () => {
    console.log("I HAVE INSTALLED CORRECTLY")
  }

  //start-stop anon core
  this.callAnonCore = function (cmd, cb) {

    var anon_binary;
    if (cmd == "stop")
      anon_binary = anon_cli;
    else if (cmd == "start") {
      anon_binary = anond;
      cmd = "-daemon";
    } else
      return cb("Command not supported");

    var execute = function (command, callback) {
      var spawn = require('child_process').spawn;
      console.log("ALL GOOD THINGS TO COME", $rootScope.path_to_executables + slash + anon_binary, [" --datadir=" + $rootScope.path_to_datadir, command], {
        shell: true
      })
      var ex = spawn("'" + $rootScope.path_to_executables + slash + anon_binary + "'", [" --datadir=" + $rootScope.path_to_datadir, command], {
        shell: true
      });

      //create listeners
      ex.once('error', function (err) {
        // ex.removeListener('error', callback(err.toString(), null, null));
        return callback(err.toString());
      });
      ex.stdout.once('data', function (stdout) {
        // ex.removeListener('data', callback(null, stdout.toString(), null));
        return callback(null, stdout.toString());
      });

      ex.stderr.once('data', function (stderr) {
        // ex.removeListener('stderr', callback(null, null, stderr.toString()));
        return callback(stderr.toString());
      });
      // if (platformInfo.OS === "Win") {
      //   //temporal hack for Windows
      //   setTimeout(function () {
      //     return callback(null, "Anon core successfully started on Windows");
      //   }, 5000)
      // }
    };

    execute(cmd, function (error, stdout) {
      $log.debug("calling anond or anon-cli done");
      $log.debug("error:", error);
      $log.debug("stdout:", stdout);

      if (error)
        return cb(error);
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

      // $http.defaults.headers.common.Authorization = 'Basic ' + btoa('user:password');
      $http.defaults.headers.common.Authorization = 'Basic ' + btoa($rootScope.RPCusername + ":" + $rootScope.RPCpassword);

      $http.post('http://localhost:3130', data, config)
        .success(function (data, status, headers, config) {
          // $scope.PostDataResponse = data;
          // $log.debug(data.result);
          // $log.debug("status:", status);
          $rootScope.testnet = data.result.testnet;
          $rootScope.mainnet = !data.result.testnet;
          return cb(data, status)
        })
        .error(function (data, status, header, config) {
          // $log.debug(data);'
          // $log.debug("status:", status);
          // $log.debug(header);
          // $log.debug(config);
          return cb(data, status)
        });
    }

    isAnonON(function (data, status) {
      $log.debug("data: ", data);
      $log.debug("status: ", status);
      //we accept status 500 because anon core is likely still verifying blocks
      if (status && status === 200 || status === 500)
        $rootScope.isAnonCoreON = true;
      else
        $rootScope.isAnonCoreON = false;
    });
  };

  // Call rpc `getinfo` rpc method
  this.localRPCGetinfo = function (cb) {
    // var rpcGetInfo = function (cb) {
    // use $.param jQuery function to serialize data from JSON
    var data = {
      "method": "getinfo"
    };
    var config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + btoa($rootScope.RPCusername + ":" + $rootScope.RPCpassword)
      }
    }

    console.log("HAHAHAHAHAHAHHA", btoa($rootScope.RPCusername + ":" + $rootScope.RPCpassword))

    // $http.defaults.headers.common.Authorization = 'Basic ' + btoa($rootScope.RPCusername + ":" + $rootScope.RPCpassword);
    $http.post('http://localhost:3130', data, config)
      .success(function (data, status, headers, config) {
        console.log("SUCCESS:", data, status)
        return cb(data, status)
      })
      .error(function (data, status, header, config) {
        console.log("Error: ", data, status)
        return cb(data, status)
      });
    // }

    // rpcGetInfo(function (data, status) {
    //   $log.debug("data: ", data);
    //   $log.debug("status: ", status);
    //     return data
    // });
  };


  //Check if the AnonCore files and Zcash Param keys exist in the default directory, and if they are readable.
  this.checkIfAnonExecFilesExistService = function (doNotCheckZKeys, cb) {
    //if user choose a custom path
    // if($rootScope.anonCoreFullPath){
    //   console.log("anonCoreFullPath exists:")
    //   console.log("Here the path: ", $rootScope.anonCoreFullPath)
    //   $rootScope.path_to_executables = $rootScope.anonCoreFullPath;
    // }
    //check if anond exists
    isFileExist($rootScope.path_to_executables + slash + anond, function (err) {
      if (err)
        return cb(err);
      //check if anon-cli exists
      isFileExist($rootScope.path_to_executables + slash + anon_cli, function (err) {
        if (err)
          return cb(err);
        if(doNotCheckZKeys)
          return cb()
        //check if zcash proving key exists
        isFileExist(path_to_zcashparams + slash + "sprout-proving.key", function (err) {
          if (err)
            return cb(err);
          //check if zcash verifying key exists
          isFileExist(path_to_zcashparams + slash + "sprout-verifying.key", function (err) {
            if (err)
              return cb(err);
            return cb()
          });
        });
      });
    });
  }

  //read anon.conf | return: (err,res)
  this.getAnonConfService = function (cb) {
    isFileExist($rootScope.path_to_datadir + slash + "anon.conf", function (err) {
      if (err)
        return cb(err);
      //if it is exist
      readFile($rootScope.path_to_datadir + slash + "anon.conf", function (err, res) {
        if (err)
          return cb(err);
        return cb(null, res);
      })
    })
  }

  //read, parse and write anon.conf | return: (err, res)
  this.setupAnonConfService = function (cb) {

    // reset_anon_conf_min_setup(anon_conf_min_setup);
    /*
      We need find out if anon.conf has all the necessary settings. If it doesn't then we have to write them.

      Function logic:
      1. We loop through anon.conf and save all the settings it has.
      2. Then we look at our anon_conf_min_setup which has all the "must have" settings and compare to anon.conf settings.
        - If it's a match we mark it in anon_conf_min_setup as "exist=true". This way later we know which settings needs to be added to anon.conf.
    */

    this.getAnonConfService(function (err, res) {

      //that's fine if anon.conf doesn't exist, we will create it later
      if (err) {
        $log.debug(err)
        // return cb(err)
      }

      //split anon conf data string into array
      var anonConfData;

      //we go here only when anon.conf exist
      if (res) {
        anonConfData = res.split(/\r?\n|\r/g);

        //regex to match new lines
        ///\n/
        ///\r?\n|\r/g - handles windows too

        //loop throught each setting in anon.conf
        for (let i = 0; i < anonConfData.length; i++) {

          //loop throught each "must have "setting in anon_conf_min_setup
          for (var command in anon_conf_min_setup) {

            //threat commented out lines as if they doesn't exist
            if (anonConfData[i].includes(command + "=") && anonConfData[i][0] !== "#") {
              //mark it as "exist"
              anon_conf_min_setup[command]['exist'] = true;

              //if anon.conf has rpcuser or rpcpassword then we want to read username and password and store it somewhere
              if (command.includes("rpcuser") || command.includes("rpcpassword")) {
                anon_conf_min_setup[command]['data'] = anonConfData[i].split('=')[1];
              }
            }
          }
        }
      }

      //no point to open a file for writing if anon.conf doesn't need to be updated
      $log.debug("anon_conf_min_setup", anon_conf_min_setup);
      if (isUpdateAnonConfRequired(anon_conf_min_setup)) {
        //check if anon.conf exist
        isFileExist($rootScope.path_to_datadir + slash + "anon.conf", function (err) {
          //when anon.conf doesn't exist
          if (err) {
            //create anon folder if doesn't exist
            ensureAnonFolderExist($rootScope.path_to_datadir, function (err) {
              if (err)
                return cb(err)
              //write anon.conf from scratch
              writeToFile($rootScope.path_to_datadir + slash + "anon.conf", formatData(anon_conf_min_setup), function (err) {
                //something went wrong during writing the file
                if (err)
                  return cb(err)
                //wrote the file successfully
                $log.debug("Anon.conf has been created");
                return cb(null, anon_conf_min_setup);
              });
            })
            //when anon.conf already exist, we just want to append the missing settings
          } else {
            appendToFile($rootScope.path_to_datadir + slash + "anon.conf", "#ADDED BY ANON COPAY WALLET\n" + formatData(anon_conf_min_setup), function (err) {
              //something went wrong during writing the file
              if (err)
                return cb(err)
              //wrote the file successfully
              $log.debug("Anon.conf has been updated");
              return cb(null, anon_conf_min_setup);
            })
          }
        })
      } else {
        $log.debug("Didn't have to update the anon.conf");
        //we didn't have to update the anon.conf, so we are done here
        return cb(null, anon_conf_min_setup);
      }
    })
  }

  //helper functions
  var fetchVerifyingKeyWin = function (callback) {
    // check if already exist
    isFileExist(path_to_zcashparams + slash + "sprout-verifying.key", function (err) {
      //if doesn't exist start downloading
      if (err) {
        //download proving key
        $log.debug("Couldn't locate sprout-verifying.key...starting to download");
        download(download_zparams_verifying_key_win, path_to_zcashparams + slash + "sprout-verifying.key", path_to_zcashparams, function (err) {
          //if something happend during downloading
          if (err)
            return callback(err)
          //successfully downloaded
          $log.debug("done writing zparams verifying key");
          return callback()
        })
        //when it already exists
      } else {
        return callback()
      }
    })
  }

  var fetchProvingKeyWin = function (callback) {
    // check if already exist
    isFileExist(path_to_zcashparams + slash + "sprout-proving.key", function (err) {
      //if doesn't exist start downloading
      if (err) {
        //download proving key
        $log.debug("Couldn't locate sprout-proving.key...starting to download");
        download(download_zparams_proving_key_win, path_to_zcashparams + slash + "sprout-proving.key", path_to_zcashparams, function (err) {
          //if something happend during downloading
          if (err)
            return callback(err)
          //successfully downloaded
          $log.debug("done writing zparams proving key");
          return callback()
        })
        //when it already exists
      } else {
        return callback()
      }
    })
  }

  var fetchZcashParamsUnix = function (callback) {
    var exec = require('child_process').exec;
    //download and run bash script
    $log.debug("Fetching Zcash Param Keys...")
    exec("curl -s https://raw.githubusercontent.com/anonymousbitcoin/anon/master/anonutil/fetch-params.sh | bash", callback);
  }

  //end of service
});
