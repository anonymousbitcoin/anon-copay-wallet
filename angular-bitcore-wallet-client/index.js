var bwcModule = angular.module('bwcModule', []);
var Client = require('../node_modules/bitcore-wallet-client-anon');
var Bitcore = require('../node_modules/bitcore-lib-anon');

bwcModule.constant('MODULE_VERSION', '1.0.0');

bwcModule.provider("bwcService", function() {
  var provider = {};

  provider.$get = function() {
    var service = {};
	//KEV & LUIS BUFFER STUFF

	service.getProposalBuffer = function() {
		return Bitcore;
	};

	// kev & luis z transaction stuff
	service.shell = function() {
		var shell = Bitcore.util.buffer;
		console.log(shell);
		return shell;
	};

    service.getBitcoreAnon = function() {
      return Client.BitcoreAnon;
    };

    service.getErrors = function() {
      return Client.errors;
    };

    service.getSJCL = function() {
      return Client.sjcl;
    };

    service.buildTx = Client.buildTx;
    service.parseSecret = Client.parseSecret;
    service.Client = Client;

    service.getUtils = function() {
      return Client.Utils;
    };

    service.getClient = function(walletData, opts) {
      opts = opts || {};

      //note opts use `bwsurl` all lowercase;
      var bwc = new Client({
        baseUrl: opts.bwsurl || 'http://198.58.124.152:3232/bws/api',
        verbose: opts.verbose,
        timeout: 100000,
        transports: ['polling'],
      });
      if (walletData)
        bwc.import(walletData, opts);
      return bwc;
    };
    return service;
  };

  return provider;
});
