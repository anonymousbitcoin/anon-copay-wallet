'use strict';

angular.module('copayApp.controllers').controller('governanceProposalCreateController', function($rootScope, $timeout, $ionicHistory, $scope, $http, appConfigService, $ionicModal, $log, lodash, profileService, platformInfo, governanceProposalService, addressbookService, gettextCatalog, walletService) {

    $scope.$on("$ionicView.enter", function(event, data) {
		$scope.governanceProposal;
		$scope.createGovernanceProposal = (governanceProposal) => {
			console.log("governanceProposal.conf will look like this:");
			console.log(governanceProposal);
			
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

	//set governanceProposal values
	governanceProposal.payment_amount = 5;
	governanceProposal.start_epoch = new Date();
	governanceProposal.start_epoch = Math.floor(governanceProposal.start_epoch.setDate(governanceProposal.start_epoch.getDate()) / 1000);
	governanceProposal.end_epoch = new Date();
	governanceProposal.end_epoch = Math.floor(governanceProposal.end_epoch.setDate(governanceProposal.end_epoch.getDate() + 30) / 1000);
	governanceProposal.type = 1;

	// declare formattedProposal (object) that contains a JSON of the users input values.
	let formattedProposal = [["proposal", governanceProposal]];
	// console.log("FORMATTED OBJECT:");
	// console.log(formattedProposal);

	// declare serialized array. contains array of the formatted proposal in serialized form.
	let serialized = governanceProposalService.serialize(formattedProposal);
	// console.log("Serialized:");
	// console.log(serialized);

	// declare newBuffer, which buffers the serialized object above. 
	var newBuffer = governanceProposalService.bufferProposal(serialized);
	// console.log("The hex???::::");
	// console.log(newBuffer);

	// declare prepareProposal, string that will be submitted.
	var prepareProposal = ("gobject prepare 0 1 " + governanceProposal.start_epoch + " " + newBuffer);
	// console.log("Prepare gobject:");
	// console.log(prepareProposal);

	// declare availableBalances, to get all the users addresses and determine which has enough funds.
	var avaliableBalances = $scope.wallet.cachedStatus.balanceByAddress;
	// console.log('ab')
	// console.log(avaliableBalances)

	// valid address will contain an address that has 5+ funds. Doesnt show others with less
	var validAddress;

	for (let i = 0; i < avaliableBalances.length; i++){
		if(avaliableBalances[i].amount > 500000001){
			validAddress = avaliableBalances[i];
			console.log("Found address with 5+ anon: ", validAddress);
			break;
		} else {
			console.log("NO ADDRESSES WITH ENOUGH FUNDS! THIS SHOULD NOT BE SEEN");
		}
	}

	console.log('validaddress')
	console.log(validAddress.address);

	// function getTxId(addressObject, cb) {
		// governanceProposalService.getTxId(addressObject, function(err, result){
			// console.log("result from govPropSer.getTxID:", result);
			// $scope.transactionID = result;
			// console.log($scope.transactionID);
			// return cb(result);
		// });
	// };

	console.log('----------------------------')
	// console.log($scope.transactionID);

	governanceProposalService.getTxId(validAddress.address, function(err, res){
		if(err){
			console.log('error')
		}
		$scope.transactionID = res;
		console.log('result here: ', res);

		let rawTx = `"[{\\"txid\\":\\"${res.txid}\\",\\"vout\\":${res.vout}}]" "{\\"${res.address}\\":5}" 0 1 ${governanceProposal.start_epoch} ${newBuffer}`;


		console.log(rawTx);
		let data = {
			"method": "createRawTransaction",
			"rawTransaction": rawTx
		};
	   //  test.writeToClipboard("some  daata");
	   //  test.downloadAnonCore("https://github.com/anonymousbitcoin/anon/releases/download/v1.3.0/Anon-full-node-v.1.3.0-win-64.zip");
	   // $scope.errorlog = test.downloadAnonCore("https://assets.anonfork.io/osx/anond");
		let config = {
			headers : {
				'Content-Type': 'application/json'
			}
		}

		// $http.defaults.headers.common.Authorization = 'Basic bHVpczpwYXNzd29yZA==';
		// $http.defaults.headers.common.Authorization = 'nick1 sbibw234ibasfisifj';


		$http.post('http://localhost:5555/insight-api-anon/gobject/createRawTransaction', data, config)
		.success(function (data, status, headers, config) {
			//  $scope.PostDataResponse = data;
			console.log(data.result);
			return cb(data.result);
			// return root.getZAddressesBalances(cb, data.result);
		})
		.error(function (data, status, header, config) {
			console.log(data);
			console.log(status);
			console.log(header);
			console.log(config);
			return data;
			// return cb(["Error", data]);
			//  $scope.ResponseDetails = "Data: " + data +
			//      "<hr />status: " + status +
			//      "<hr />headers: " + header +
			//      "<hr />config: " + config;
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
  
	  console.log('allwallets:');
	  console.log(allWallets);
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

console.log('allwallets:');
console.log(allWallets);

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
	console.log('makeVisible Clicked');
  };

  $scope.showWalletSelector = function() {
    if ($scope.singleWallet) return;
    $scope.walletSelectorTitle = gettextCatalog.getString('Select a wallet');
	$scope.showWallets = true;
	$scope.showModal = true;
	console.log('showwalletselector clicked');

  };




});
