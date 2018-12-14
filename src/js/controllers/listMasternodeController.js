'use strict';

angular.module('copayApp.controllers').controller('listMasternodeController', function ($ionicHistory, $scope, $ionicModal, $log, listMasternodeService, ongoingProcess) {

  $scope.$on("$ionicView.beforeEnter", function (event, data) {
    listMasternodeService.list(function (err, masternodes) {
      if (err) {
        $log.error(err);
      }
      $scope.masternodes = masternodes;
      // console.log('controller: ')
      // console.log(masternodes);
    })
  });


  //   $scope.add = function(masternode) {
  //     $timeout(function() {
  // 		listMasternodeService.add(masternode, function(err, mn) {
  // 		console.log("ALL MASTERNODES: ", mn)
  // 		if (err) {
  //           popupService.showAlert(gettextCatalog.getString('Error'), err);
  //           return;
  //         }
  //         if ($scope.fromSendTab) $scope.goHome();
  // 		else $ionicHistory.goBack();
  //       });
  // 	}, 100)
  //   };

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

  $scope.openMasternodeDetailModal = function (masternode) {
    $ionicModal.fromTemplateUrl('views/modals/masternode-detail.html', {
      scope: $scope
    }).then(function (modal) {
      $scope.masternode = masternode;
      $scope.masternode.activeseconds = secondsToDhms(masternode.activeseconds);
      $scope.masternode.ip = masternode.ip;
      $scope.masternode.lastseen = new Date(masternode.lastseen * 1000).toLocaleString();
      $scope.masternode.payee = masternode.payee;
      $scope.masternode.protocol = masternode.protocol;
      $scope.masternode.rank = masternode.rank;
      $scope.masternode.status = masternode.status;
      $scope.masternode.vin = masternode.vin;
      $scope.masternodeDetailInfo = modal;
      $scope.masternodeDetailInfo.show();
    });

    $scope.close = function () {
      $scope.masternodeDetailInfo.hide();
    };
  };

  $scope.goHome = function () {
    $ionicHistory.removeBackView();
    $state.go('tabs.home');
  };

  function secondsToDhms(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 3600 % 60);

    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (" hr, ") : "";
    var mDisplay = m > 0 ? m + (" min, ") : "";
    var sDisplay = s > 0 ? s + (" sec") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
  }

});
