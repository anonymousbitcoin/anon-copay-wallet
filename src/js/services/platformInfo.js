'use strict';

angular.module('copayApp.services').factory('platformInfo', function($window) {

  var ua = navigator ? navigator.userAgent : null;

  if (!ua) {
    console.log('Could not determine navigator. Using fixed string');
    ua = 'dummy user-agent';
  }

  // Fixes IOS WebKit UA
  ua = ua.replace(/\(\d+\)$/, '');

  var whichOS = function() {
    if(navigator.platform.indexOf('Win') > -1)
      return "Win";
    else if (navigator.platform.indexOf('Mac') > -1)
      return "Mac";
    else 
      return "Unsupported";
  };

  var isNodeWebkit = function() {
    var isNode = (typeof process !== "undefined" && typeof require !== "undefined");
    if (isNode) {
      try {
        return (typeof require('nw.gui') !== "undefined");
      } catch (e) {
        return false;
      }
    }
  };

  var getVersionIntelTee = function() {
    var v = '';
    var isWindows = navigator.platform.indexOf('Win') > -1;

    if (!isNodeWebkit() || !isWindows) {
      return v;
    }

    try {
      var IntelWallet = require('intelWalletCon');
      if (IntelWallet.getVersion) {
        v = IntelWallet.getVersion();
      } else {
        v = 'Alpha';
      }
      if (v.length > 0) {
        $log.info('Intel TEE library ' + v);
      }
    } catch (e) {}
    return v;
  };

  // Detect mobile devices
  var ret = {
    isAndroid: ionic.Platform.isAndroid(),
    isIOS: ionic.Platform.isIOS(),
    isWP: ionic.Platform.isWindowsPhone() || ionic.Platform.platform() == 'edge',
    isSafari: Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0,
    ua: ua,
    isCordova: !!$window.cordova,
    isNW: isNodeWebkit(),
    OS: whichOS()
  };

  ret.isMobile = ret.isAndroid || ret.isIOS || ret.isWP;
  ret.isChromeApp = $window.chrome && chrome.runtime && chrome.runtime.id && !ret.isNW;
  ret.isDevel = !ret.isMobile && !ret.isChromeApp && !ret.isNW;

  ret.supportsLedger = ret.isChromeApp;
  // ret.supportsTrezor = ret.isChromeApp || ret.isDevel;
  ret.supportsTrezor = false;

  ret.versionIntelTEE = getVersionIntelTee();
  ret.supportsIntelTEE = ret.versionIntelTEE.length > 0;

  return ret;
});
