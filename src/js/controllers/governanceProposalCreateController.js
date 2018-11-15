'use strict';

angular.module('copayApp.controllers').controller('governanceProposalCreateController', function($rootScope, $timeout, $ionicHistory, $scope, appConfigService, $ionicModal, $log, lodash, profileService, platformInfo, governanceProposalService) {

    $scope.$on("$ionicView.enter", function(event, data) {
		$scope.governanceProposal;
		$scope.createGovernanceProposal = (governanceProposal) => {
			console.log(governanceProposal);
			console.log("governanceProposal.conf will look like this:");
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
    // $timeout(function() {
	// 	governanceProposalCreateService.add(governanceProposal, function(err, mn) {
	// 	console.log("ALL MASTERNODES: ", mn)
	// 	if (err) {
    //       popupService.showAlert(gettextCatalog.getString('Error'), err);
    //       return;
    //     }
    //     if ($scope.fromSendTab) $scope.goHome();
	// 	else $ionicHistory.goBack();
    //   });
	// }, 100)
	governanceProposal.start_epoch = new Date();
	governanceProposal.start_epoch = Math.floor(governanceProposal.start_epoch.setDate(governanceProposal.start_epoch.getDate()) / 1000);
	governanceProposal.end_epoch = new Date();
	governanceProposal.end_epoch = Math.floor(governanceProposal.end_epoch.setDate(governanceProposal.end_epoch.getDate() + 30) / 1000);
	governanceProposal.type = 1;


	let formattedProposal = [["proposal", governanceProposal]];
	console.log("FORMATTED OBJECT:");
	console.log(formattedProposal);

	let serialized = governanceProposalService.serialize(formattedProposal);
	console.log("Serialized:");
	console.log(serialized);

	// var newBuffer = serialized.toBuffer().toString('hex');
	// var newBuffer = Buffer(serialized);
	var newBuffer = governanceProposalService.bufferProposal(serialized);
	// console.log("newBuffer:");
	// console.log(newBuffer);
	// var newBuffer = Buffer.from(first);

	// var dataview = new DataView(newBuffer);



	// console.log("dataview");
	// console.log(dataview);
	// dataview.setUint8(0, 3);            
	// dataview.setUint32(1, parseInt('0x00040000'), true);

	// var newBuffer = new Buffer(serialized);
	// console.log("NewBuffer");
	// console.log(newBuffer.byteLength);

	// console.log("Buffered: ");
	// let buffered = newBuffer.toString('hex')
	// console.log(buffered);
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
