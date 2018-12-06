'use strict';

angular.module('copayApp.controllers').controller('governanceProposalCreateController', function($rootScope, $timeout, $ionicHistory, $scope, appConfigService, $ionicModal, $log, lodash, profileService, platformInfo, governanceProposalService, addressbookService, gettextCatalog, walletService) {

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


	let formattedProposal = [["proposal", governanceProposal]];

	let serialized = governanceProposalService.serialize(formattedProposal);

	// var newBuffer = serialized.toBuffer().toString('hex');
	// var newBuffer = Buffer(serialized);
	var newBuffer = governanceProposalService.bufferProposal(serialized);


	var prepareProposal = ("gobject prepare 0 1 " + governanceProposal.start_epoch + " " + newBuffer);
	

	var avaliableBalances = $scope.wallet.cachedStatus.balanceByAddress;
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
	});
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
//   $scope.openGovernanceProposalModal = function(proposal) {
//     $ionicModal.fromTemplateUrl('views/modals/governance-proposal-info.html', {
//       scope: $scope
//     }).then(function(modal) {
//       $scope.proposal = proposal
//       $scope.governanceProposalInfo = modal;
//       $scope.governanceProposalInfo.show();
//     });

//     $scope.close = function() {
//       $scope.governanceProposalInfo.hide();
//     };
//   };

  $scope.goHome = function() {
    $ionicHistory.removeBackView();
    $state.go('tabs.home');
  };

//   $scope.openWalletSelectModal = function() {
//     $ionicModal.fromTemplateUrl('views/modals/wallets.html', {
//       scope: $scope
//     }).then(function(modal) {
//     //   $scope.proposal = proposal
//     //   $scope.proposal.DataObject.start_epoch = new Date(proposal.DataObject.start_epoch * 1000).toLocaleString()
//     //   $scope.proposal.DataObject.end_epoch = new Date(proposal.DataObject.end_epoch * 1000).toLocaleString()
//       $scope.governanceProposalInfo = modal;
//       $scope.governanceProposalInfo.show();
//     });

//     $scope.close = function() {
//       $scope.governanceProposalInfo.hide();
//     };
//   };
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
