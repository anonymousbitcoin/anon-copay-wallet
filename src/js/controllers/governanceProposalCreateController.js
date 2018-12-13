'use strict';

angular.module('copayApp.controllers').controller('governanceProposalCreateController', function($rootScope, $timeout, $ionicHistory, $scope, $http, appConfigService, $ionicModal, $log, lodash, profileService, platformInfo, governanceProposalService, addressbookService, gettextCatalog, walletService) {

    $scope.$on("$ionicView.enter", function(event, data) {
		$scope.governanceProposal;
		$scope.createGovernanceProposal = (governanceProposal) => {
		};
    });

  $scope.$on("$ionicView.beforeEnter", function(event, data) {
    $scope.isCordova = platformInfo.isCordova;
    $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
    $scope.isDevel = platformInfo.isDevel;
    $scope.appName = appConfigService.nameCase;
    configService.whenAvailable(function(config) {
      $scope.locked = config.lock && config.lock.method;
      if (!$scope.locked || $scope.locked == 'none')
        $scope.method = gettextCatalog.getString('Disabled');
      else
        $scope.method = $scope.locked.charAt(0).toUpperCase() + config.lock.method.slice(1);
    });
  });


  $scope.add = function(governanceProposal) {
	governanceProposal.payment_amount = 5;
	governanceProposal.start_epoch = new Date();
	governanceProposal.start_epoch = Math.floor(governanceProposal.start_epoch.setDate(governanceProposal.start_epoch.getDate()) / 1000);
	governanceProposal.end_epoch = new Date();
	governanceProposal.end_epoch = Math.floor(governanceProposal.end_epoch.setDate(governanceProposal.end_epoch.getDate() + 30) / 1000);
	governanceProposal.type = 1;

	// declare formattedProposal (object) that contains a JSON of the users input values.
	let formattedProposal = [["proposal", governanceProposal]];

	// declare serialized array. contains array of the formatted proposal in serialized form.
	let serialized = governanceProposalService.serialize(formattedProposal);

	// declare newBuffer, which buffers the serialized object above.
	var newBuffer = governanceProposalService.bufferProposal(serialized);

	// declare prepareProposal, string that will be submitted.
	var prepareProposal = ("gobject prepare 0 1 " + governanceProposal.start_epoch + " " + newBuffer);


	// declare availableBalances, to get all the users addresses and determine which has enough funds.
	var avaliableBalances = $scope.wallet.cachedStatus.balanceByAddress;
	// console.log('ab')
	// console.log(avaliableBalances)

	// valid address will contain an address that has 5+ funds. Doesnt show others with less
	var validAddress;

	for (let i = 0; i < avaliableBalances.length; i++){
		if(avaliableBalances[i].amount > 500000001){
			validAddress = avaliableBalances[i];
			break;
		} else {
		}
	}

	walletService.getMainAddresses($scope.wallet, null, (err, result) => {
		let numAddresses = result.length;
		let address;

		for (let i = 0; i < numAddresses; i++) {
			if(result[i].address == validAddress.address){
				address = result[i].address;
				break;
			}
		}
		let addy = address;
		// if (address != avaliableBalances){
		// 	address = result[1].address;
		// }
		governanceProposalService.getTxId(addy, function(err, result){
			return result;
		});
		// bitcore api (rawTX)
		// {
		// 	RPC BROADCAST (trawtx)
			// result = transaction from submit
		// }

		// get transastion from submit
		// reformat string to show 'submit', append tx at end.
		// broadcast submit


	})

	// console.log(addressTxOut);

	// walletService.getMainAddresses($scope.wallet, null, (err, result) => {

	// 	// loop through and find the correct address
	// 	console.log('result from GMA')

	// 	console.log(result)
	// 	let numAddresses = result.length;
	// 	let address;
	// 	let sweetResult;

	// 	for (let i = 0; i < numAddresses; i++) {
	// 		if(result[i].address == validAddress.address){
	// 			address = result[i].address;
	// 			console.log("ADDRESS: ", address)
	// 			break;
	// 		}
	// 	}
	// 	let addy = address;

	// 	governanceProposalService.getTxId(addy, function(err, result){
	// 		console.log("result from govPropSer.getTxID:");
	// 		console.log(result);
	// 		sweetResult = result;
	// 		console.log('sweetresult', sweetResult)
	// 		return result;
	// 	});

	// 	// undefined
	// 	console.log('sweetresult', sweetResult)
	// });


  };

	$scope.showWallets = function(){
		var opts = {};
		opts.m = 1;
		opts.n = 1;
		opts.networkName = 'testnet';
		opts.coin = 'anon';
		opts.hasFunds = true;
		opts.minAmount = 500000100;

	  var allWallets = profileService.getWallets(opts);

	}


  $scope.goHome = function() {
    $ionicHistory.removeBackView();
    $state.go('tabs.home');
  };

$scope.setAddress = function(newAddr) {
    $scope.addr = null;
    if (!$scope.wallet || $scope.generatingAddress || !$scope.wallet.isComplete()) return;
    $scope.generatingAddress = true;
    walletService.getAddress($scope.wallet, newAddr, function(err, addr) {
      $scope.generatingAddress = false;

      if (err) {
        //Error is already formated
        popupService.showAlert(err);
      }

      $scope.addr = addr;
      $timeout(function() {
        $scope.$apply();
      }, 10);
    });
  };


var setProtocolHandler = function() {
    $scope.protocolHandler = walletService.getProtocolHandler($scope.wallet);
}

var opts = {};
opts.m = 1;
opts.n = 1;
opts.networkName = 'testnet';
opts.coin = 'anon';
opts.hasFunds = true;
opts.minAmount = 500000100;

var allWallets = profileService.getWallets(opts);

$scope.wallets = allWallets;
$scope.walletSelectorTitle = "All The Wallets"
// $scope.showWallets = false;
  $scope.onWalletSelect = function(wallet) {
    $scope.wallet = wallet;
    setProtocolHandler();
    $scope.setAddress();
  };

  $scope.showModal = false;

  $scope.makeVisible = function() {
	$scope.showModal = true;
  };

  $scope.showWalletSelector = function() {
    if ($scope.singleWallet) return;
    $scope.walletSelectorTitle = gettextCatalog.getString('Select a wallet');
	$scope.showWallets = true;
	$scope.showModal = true;

  };
});
