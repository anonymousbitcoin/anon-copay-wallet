'use strict';

angular.module('copayApp.controllers').controller('tabReceiveController', function($rootScope, $scope, $timeout, $log, $ionicModal, $state, $ionicHistory, $ionicPopover, storageService, platformInfo, walletService, profileService, configService, lodash, gettextCatalog, popupService, bwcError) {

  var listeners = [];
  $scope.isCordova = platformInfo.isCordova;
  $scope.isNW = platformInfo.isNW;

  $scope.requestSpecificAmount = function() {
    $state.go('tabs.paymentRequest.amount', {
      id: $scope.wallet.credentials.walletId,
      coin: $scope.wallet.coin
    });
  };

  $scope.setAddress = function(newAddr) {
    console.log("I AM THE SCOPE", $scope)
    $scope.addr = null;
    console.log("!$scope.wallet || $scope.generatingAddress", !$scope.wallet || $scope.generatingAddress)
    if (!$scope.wallet || $scope.generatingAddress) return;
    
    if ($scope.wallet.zWallet){
      $scope.generateZAddress();
      console.log("I HAVE GENERatED A NEW Z ADDRESS")
      return;
    } 
    $scope.generatingAddress = true;
    console.log("DO I M AKE IT HERe?")
    walletService.getAddress($scope.wallet, newAddr, function(err, addr) {
      $scope.generatingAddress = false;

      if (err) {
        //Error is already formated
        popupService.showAlert(err);
      }

      $scope.addr = addr;
      console.log("I AM THE NEW Z ADDRESS", $scope.addr)
      $timeout(function() {
        $scope.$apply();
      }, 10);
    });
  };

  $scope.generateZAddress = () => {
    walletService.getZTransactions((addresses) => {
      let zAddresses = []
      let largestAddress = {
        balance: 0
      };
      addresses.forEach((val, ix) => {
        if (val.balance  !== 0 && val.balance > largestAddress.balance)
        largestAddress = val;
        zAddresses.push(val) 
      })

      $scope.addr = largestAddress.address
      $scope.address = largestAddress.address
      console.log($scope.addr)
      $scope.zAddresses = zAddresses;
    });
  }

  $scope.generateZNewAddress = () => {
    walletService.getNewZAddresss((address) => {

      $scope.addr = address
      $scope.address = address
      console.log("DAFGHDFGADGHSARGASDFG", $scope.addr)
    });
  }

  $scope.goCopayers = function() {
    $ionicHistory.removeBackView();
    $ionicHistory.nextViewOptions({
      disableAnimate: true
    });
    $state.go('tabs.home');
    $timeout(function() {
      $state.transitionTo('tabs.copayers', {
        walletId: $scope.wallet.credentials.walletId
      });
    }, 100);
  };

  $scope.openBackupNeededModal = function() {
    $ionicModal.fromTemplateUrl('views/includes/backupNeededPopup.html', {
      scope: $scope,
      backdropClickToClose: false,
      hardwareBackButtonClose: false
    }).then(function(modal) {
      $scope.BackupNeededModal = modal;
      $scope.BackupNeededModal.show();
    });
  };

  $scope.close = function() {
    $scope.BackupNeededModal.hide();
    $scope.BackupNeededModal.remove();
  };

  $scope.doBackup = function() {
    $scope.close();
    $scope.goToBackupFlow();
  };

  $scope.goToBackupFlow = function() {
    $state.go('tabs.receive.backupWarning', {
      from: 'tabs.receive',
      walletId: $scope.wallet.credentials.walletId
    });
  };

  $scope.shouldShowReceiveAddressFromHardware = function() {
    var wallet = $scope.wallet;
    if (!wallet.zWallet && wallet.isPrivKeyExternal() && wallet.credentials.hwInfo) {
      return (wallet.credentials.hwInfo.name == walletService.externalSource.intelTEE.id);
    } else {
      return false;
    }
  };

  $scope.showReceiveAddressFromHardware = function() {
    var wallet = $scope.wallet;
    if (!wallet.zWallet && wallet.isPrivKeyExternal() && wallet.credentials.hwInfo) {
      walletService.showReceiveAddressFromHardware(wallet, $scope.addr, function() {});
    }
  };

  $scope.$on("$ionicView.beforeEnter", function(event, data) {

    // storageService.getAddressbook('testnet', function(err, ab) {
    //   // if (err) return cb(err);
    //   if (ab) ab = JSON.parse(ab);
      // if (ab && ab[addr]) return cb(null, ab[addr]);
      // return cb();
    // });
    $scope.wallets = profileService.getWallets();

    walletService.getZTotalBalance((result) => {
      $scope.privateBalance = result.private;
      console.log("WES MONTGOMERY", $scope.wallets)
      $scope.wallets.push({
        name: "Z Wallet",
        zWallet: true,
        cachedBalance: $scope.privateBalance,
        status : {
          availableBalanceStr: $scope.privateBalance + " ANON",
          totalBalanceStr:  $scope.privateBalance + " ANON",
        }
      })
    });

    console.log($scope.wallets);
    $scope.singleWallet = $scope.wallets.length == 1;

    if (!$scope.wallets[0]) return;

    // select first wallet if no wallet selected previously
    var selectedWallet = checkSelectedWallet($scope.wallet, $scope.wallets);
    $scope.onWalletSelect(selectedWallet);

    $scope.showShareButton = platformInfo.isCordova ? (platformInfo.isIOS ? 'iOS' : 'Android') : null;

    listeners = [
      $rootScope.$on('bwsEvent', function(e, walletId, type, n) {
        // Update current address
        if ($scope.wallet && walletId == $scope.wallet.id && type == 'NewIncomingTx') $scope.setAddress(true);
      })
    ];
  });

  $scope.$on("$ionicView.leave", function(event, data) {
    lodash.each(listeners, function(x) {
      x();
    });
  });

  var checkSelectedWallet = function(wallet, wallets) {
    if (!wallet) return wallets[0];
    var w = lodash.find(wallets, function(w) {
      return w.id == wallet.id;
    });
    if (!w) return wallets[0];
    return wallet;
  }

  var setProtocolHandler = function() {
    $scope.protocolHandler = walletService.getProtocolHandler($scope.wallet);
  }

  $scope.onWalletSelect = function(wallet) {
    console.log("ON WALLET SELECT SELECTED")
    $scope.wallet = wallet;
    setProtocolHandler();
    $scope.setAddress();
  };

  $scope.showWalletSelector = function() {
    if ($scope.singleWallet) return;
    $scope.walletSelectorTitle = gettextCatalog.getString('Select a wallet');
    $scope.showWallets = true;
  };

  $scope.onAddressSelect = function(address) {
    console.log("HEY HEY HEY HEY HEYUH")
    $scope.address = address;
    $scope.addr = address.address;
    // setProtocolHandler();
    // $scope.setAddress();
  };

  $scope.showAddressSelector = function() {
    console.log("I HAVE BEEN SELECTED")
    if ($scope.singleAddress) return;
    $scope.addressSelectorTitle = gettextCatalog.getString('Select a address');
    $scope.showAddresses = true;
    console.log("VItAMin c", $scope.zAddresses)
    console.log("WE WAX AND WANE")
  };

  $scope.shareAddress = function() {
    if (!$scope.isCordova) return;
    var protocol = 'anon';
    window.plugins.socialsharing.share(protocol + ':' + $scope.addr, null, null, null);
  }
});
