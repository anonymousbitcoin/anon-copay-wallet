'use strict';

angular.module('copayApp.controllers').controller('masternodeCreateController', function($rootScope, $timeout, $ionicHistory, $scope, appConfigService, $ionicModal, $log, lodash, profileService, platformInfo, masternodeCreateService) {

	// function serialize(targetObject) {
	// 	if (typeof targetObject !== "object")
	// 		return console.error("Data for serializing must be an object");
	// 	let result = []
	// 	targetObject = JSON.stringify(targetObject);
	// 	for (let i = 0; i < targetObject.length; i++) {
	// 		result.push(targetObject.charCodeAt(i));
	// 	}
	// 	return result;
	// }
	
	// function deserialize(serialized_data) {
	// 	if (!Array.isArray(serialized_data))
	// 		return console.error("Data for deserialization must be an array");
	// 	let result = "";
	// 	for (let i = 0; i < serialized_data.length; i++) {
	// 		result += String.fromCharCode(serialized_data[i]);
	// 	}
	// 	result = JSON.parse(result);
	// 	return result;
	// }

    $scope.$on("$ionicView.enter", function(event, data) {
		$scope.masternode;
		$scope.createMasternode = (masternode) => {
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


  $scope.add = function(masternode) {
    $timeout(function() {
		masternodeCreateService.add(masternode, function(err, mn) {
		if (err) {
          popupService.showAlert(gettextCatalog.getString('Error'), err);
          return;
        }
        if ($scope.fromSendTab) $scope.goHome();
		else $ionicHistory.goBack();
      });
	}, 100)
  };

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


});
