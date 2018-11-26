'use strict';

angular.module('copayApp.services').service('test', function (nodeWebkitService, $http) {
  this.readFromClipboard = function () {
    var gui = require('nw.gui');
    var clipboard = gui.Clipboard.get();
    return clipboard.get();
  };

  this.writeToClipboard = function (text) {
    var gui = require('nw.gui');
    var clipboard = gui.Clipboard.get();
    return clipboard.set(text);
  };

  this.openExternalLink = function (url) {
    var gui = require('nw.gui');
    return gui.Shell.openExternal(url);
  };

  this.downloadAnonCore = async function (url) {
    console.log("inside downloadAnonCore")
    console.log(url)
    this.writeToClipboard("downloadAnonCore 1");
    // var fs = require('fs');
    // var http = require('http');
    // var https = require('https');
    // var path = require('path');

    // const { promisify } = require('util');
    const exec = promisify(require('child_process').exec)
    this.writeToClipboard("before stopAnonCore");
    var that = this;
    function stopAnonCore() {
      that.writeToClipboard("inside stopAnonCore");
    exec('/Users/nlevo/Desktop/Crypto/public-anon/anon/src/anon-cli stop', {maxBuffer: 1024 * 5000})
  };
    stopAnonCore();
    console.log('HELLO WORLD');

  //   var path = process.env['HOME'] + "/testcopay/anond";
  //   var file = fs.createWriteStream(path);

  //   var request = "Not done";
  //   request = https.get(url, function (response) {
  //     response.pipe(file);
  //     request = "done";
  //   });

  //   return request;


    // var download = await https.get(url, function (response) {
    //   // return url;
    //   var path = process.env['HOME'] + "/testcopay/anond";
    //   var newFile = 'new_file';
    //   var piped = response.pipe(fs.createWriteStream(newFile));
    // });
    // return download;

    // const Fs = require('fs')
    // const Path = require('path')
    // const Axios = require('axios')

    // async function downloadImage() {

    //   const url = 'https://unsplash.com/photos/AaEQmoufHLk/download?force=true'
    //   const path = process.env['HOME'] + "/testcopay/anond.jpg"

    //   // axios image download with response type "stream"
    //   const response = await Axios({
    //     method: 'GET',
    //     url: url,
    //     responseType: 'stream'
    //   })

    //   // pipe the result stream into a file on disc
    //   response.data.pipe(Fs.createWriteStream(path))

    //   // return a promise and resolve when download finishes
    //   return new Promise((resolve, reject) => {
    //     response.data.on('end', () => {
    //       resolve()
    //     })

    //     response.data.on('error', () => {
    //       reject()
    //     })
    //   })

    // }

    // await downloadImage()
    // var fs = require('fs');
    // var http = require('http');
    // var https = require('https');

    // this.writeToClipboard("" + process.env['HOME']);
    // var file = fs.createWriteStream(process.env['HOME'] + "/testcopay/anond");

    // var request = https.get(url, function (response) {
    //   this.writeToClipboard("" + response.statusCode.toString());
    //   response.pipe(file);
    //   file.on('finish', function() {
    //     file.close(cb);  // close() is async, call cb after close completes.
    //   });
    // });

    //   this.downloadAnonCore = function (url) {
    //     var fs = require('fs');
    //     var http = require('http');

    //     // this.writeToClipboard("" + process.env['HOME']);

    //     var request = http.get(url, function (response) {
    //       this.writeToClipboard(JSON.stringify(response));
    //       // this.writeToClipboard("" + response.statusCode);
    //       var path = process.env['HOME'] + "/anon_exec/anond"
    //         fs.writeFile(path, response.pipe(file), (err) => {
    //         if (err) 
    //         this.writeToClipboard(err.toString());
    //         console.log('The file has been saved!');
    //         });
    //         file.on('finish', function() {
    //             file.close(cb);  // close() is async, call cb after close completes.
    //         });
    // });

    // var download = function(url, dest, cb) {
    //   var file = fs.createWriteStream(dest);
    //   var request = http.get(url, function(response) {
    //     response.pipe(file);
    //     file.on('finish', function() {
    //       file.close(cb);  // close() is async, call cb after close completes.
    //     });
    //   });
    // }

    // const { promisify } = require('util');
    // const exec = promisify(require('child_process').exec)

    // async function stopNode() {
    //   const mnodes = await exec('/Users/nlevo/Desktop/Crypto/public-anon/anon/src/anon-cli stop', {
    //     maxBuffer: 1024 * 5000
    //   })
    //   return { mnodes };
    // };
    // stopNode();
  };

});

// angular.module('copayApp.services')
//   .factory('test', function(lodash, $log) {
//     var root = {},
//       _fs, _dir;

//     root.init = function(cb) {
//       if (_dir) return cb(null, _fs, _dir);

//       function onFileSystemSuccess(fileSystem) {
//         console.log('File system started: ', fileSystem.name, fileSystem.root.name);
//         _fs = fileSystem;
//         root.getDir(function(err, newDir) {
//           if (err || !newDir.nativeURL) return cb(err);
//           _dir = newDir
//           $log.debug("Got main dir:", _dir.nativeURL);
//           return cb(null, _fs, _dir);
//         });
//       }

//       function fail(evt) {
//         var msg = 'Could not init file system: ' + evt.target.error.code;
//         console.log(msg);
//         return cb(msg);
//       };

//       window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, fail);
//     };

//     root.get = function(k, cb) {
//       root.init(function(err, fs, dir) {
//         if (err) return cb(err);
//         dir.getFile(k, {
//           create: false,
//         }, function(fileEntry) {
//           if (!fileEntry) return cb();
//           fileEntry.file(function(file) {
//             var reader = new FileReader();

//             reader.onloadend = function(e) {
//               return cb(null, this.result)
//             }

//             reader.readAsText(file);
//           });
//         }, function(err) {
//           // Not found
//           if (err.code == 1) return cb();
//           else return cb(err);
//         });
//       })
//     };

//     var writelock = {};

//     root.set = function(k, v, cb, delay) {

//       delay = delay || 100;

//       if (writelock[k]) {
//         return setTimeout(function() {
//           console.log('## Writelock for:' + k + ' Retrying in ' + delay);
//           return root.set(k, v, cb, delay + 100);
//         }, delay);
//       }

//       writelock[k] = true;
//       root.init(function(err, fs, dir) {
//         if (err) {
//           writelock[k] = false;
//           return cb(err);
//         }
//         dir.getFile(k, {
//           create: true,
//         }, function(fileEntry) {
//           // Create a FileWriter object for our FileEntry (log.txt).
//           fileEntry.createWriter(function(fileWriter) {

//             fileWriter.onwriteend = function(e) {
//               console.log('Write completed:' + k);
//               writelock[k] = false;
//               return cb();
//             };

//             fileWriter.onerror = function(e) {
//               var err = e.error ? e.error : JSON.stringify(e);
//               console.log('Write failed: ' + err);
//               writelock[k] = false;
//               return cb('Fail to write:' + err);
//             };

//             if (lodash.isObject(v))
//               v = JSON.stringify(v);

//             if (v && !lodash.isString(v)) {
//               v = v.toString();
//             }

//             $log.debug('Writing:', k, v);
//             fileWriter.write(v);

//           }, cb);
//         });
//       });
//     };


//     // See https://github.com/apache/cordova-plugin-file/#where-to-store-files
//     root.getDir = function(cb) {
//       if (!cordova.file) {
//         return cb('Could not write on device storage');
//       }

//       var url = cordova.file.dataDirectory;
//       // This could be needed for windows
//       // if (cordova.file === undefined) {
//       //   url = 'ms-appdata:///local/';
//       window.resolveLocalFileSystemURL(url, function(dir) {
//         return cb(null, dir);
//       }, function(err) {
//         $log.warn(err);
//         return cb(err || 'Could not resolve filesystem:' + url);
//       });
//     };

//     root.remove = function(k, cb) {
//       root.init(function(err, fs, dir) {
//         if (err) return cb(err);
//         dir.getFile(k, {
//           create: false,
//         }, function(fileEntry) {
//           // Create a FileWriter object for our FileEntry (log.txt).
//           fileEntry.remove(function() {
//             console.log('File removed.');
//             return cb();
//           }, cb);
//         }, cb);
//       });
//     };

//     /**
//      * Same as setItem, but fails if an item already exists
//      */
//     root.create = function(name, value, callback) {
//       root.get(name,
//         function(err, data) {
//           if (data) {
//             return callback('EEXISTS');
//           } else {
//             return root.set(name, value, callback);
//           }
//         });
//     };

//     return root;
//   });
