'use strict';

angular.module('copayApp.controllers').controller('listMasternodeController', function($rootScope, $timeout, $ionicHistory, $scope, appConfigService, $ionicModal, $log, lodash, profileService, platformInfo, listMasternodeService) {

    $scope.$on("$ionicView.beforeEnter", function(event, data) {
      listMasternodeService.list(function(err, masternodes){
        if(err) $log.error(err);
        $scope.masternodes = masternodes;
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

  $scope.openMasternodeDetailModal = function(masternode) {
    $ionicModal.fromTemplateUrl('views/modals/masternode-detail.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.masternode = masternode;
      $scope.masternode.activeseconds = masternode.activeseconds;
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

    $scope.close = function() {
      $scope.masternodeDetailInfo.hide();
    };
  };

  $scope.goHome = function() {
    $ionicHistory.removeBackView();
    $state.go('tabs.home');
  };


});
