'use strict';

angular.module('copayApp.controllers').controller('governanceProposalsController', function($rootScope, $timeout, $scope, appConfigService, $ionicModal, $log, lodash, profileService, platformInfo, governanceProposalService, configService) {


    $scope.$on("$ionicView.beforeEnter", function(event, data) {
        governanceProposalService.list(function(err, proposals) {
            if (err) $log.error(err);
            $scope.proposals = proposals;
        });
    });

  // $scope.$on("$ionicView.beforeEnter", function(event, data) {
  //   $scope.isCordova = platformInfo.isCordova;
  //   $scope.isWindowsPhoneApp = platformInfo.isCordova && platformInfo.isWP;
  //   $scope.isDevel = platformInfo.isDevel;
  //   $scope.appName = appConfigService.nameCase;
  //   configService.whenAvailable(function(config) {
  //     $scope.locked = config.lock && config.lock.method;
  //     if (!$scope.locked || $scope.locked == 'none')
  //       $scope.method = gettextCatalog.getString('Disabled');
  //     else
  //       $scope.method = $scope.locked.charAt(0).toUpperCase() + config.lock.method.slice(1);
  //   });
  // });

  $scope.openGovernanceProposalModal = function(proposal) {
    $ionicModal.fromTemplateUrl('views/modals/governance-proposal-info.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.proposal = proposal
      $scope.proposal.DataObject.start_epoch = new Date(proposal.DataObject.start_epoch * 1000).toLocaleString()
      $scope.proposal.DataObject.end_epoch = new Date(proposal.DataObject.end_epoch * 1000).toLocaleString()
      $scope.governanceProposalInfo = modal;
      $scope.governanceProposalInfo.show();
    });

    $scope.close = function() {
      $scope.governanceProposalInfo.hide();
    };
  };


});
