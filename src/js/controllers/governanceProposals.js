'use strict';

angular.module('copayApp.controllers').controller('governanceProposalsController', function($rootScope, $timeout, $scope, appConfigService, $ionicModal, $log, lodash, profileService, platformInfo, governanceProposalService) {

    console.log("sfkghadfbhnbsdnbha")

    $scope.fetchingProposals = true;
    $scope.$on("$ionicView.enter", function(event, data) {
        console.log("llllllllllllll")
        governanceProposalService.list(function(err, proposals) {
            if (err) $log.error(err);
            $scope.proposals = proposals;
            console.log($scope.proposals);
            $scope.fetchingProposals = false;
            console.log("HERE")
            // profileService.getProposals(function(err, proposals) {
            //     console.log("DAN THE DANCER", proposals)
            // $scope.fetchingProposals = false;
            //     if (err) {
            //         $log.error(err);
            //         return;
            //     }
            //     $scope.proposals = proposals;
            //     $timeout(function() {
            //         $scope.$apply();
            //     });
            // });
        });
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

  $scope.openGovernanceProposalModal = function(proposal) {
    $ionicModal.fromTemplateUrl('views/modals/governance-proposal-info.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.proposal = proposal
      $scope.governanceProposalInfo = modal;
      $scope.governanceProposalInfo.show();
    });

    $scope.close = function() {
      $scope.governanceProposalInfo.hide();
    };
  };


});
