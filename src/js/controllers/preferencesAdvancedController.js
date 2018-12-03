'use strict';

angular.module('copayApp.controllers').controller('preferencesAdvancedController', function($scope, $timeout, $state, $stateParams, profileService) {
  var wallet = profileService.getWallet($stateParams.walletId);
  
  $scope.zWallet = $stateParams.zWallet;

  if(!$scope.zWallet) {
    $scope.network = wallet.network;
    $scope.wallet = wallet;
  }

  $scope.goToAddresses = function() {
    $state.go('tabs.settings.addresses', {
      walletId: $stateParams.walletId,
    });
  };

  $timeout(function() {
    $scope.$apply();
  }, 1);
});
