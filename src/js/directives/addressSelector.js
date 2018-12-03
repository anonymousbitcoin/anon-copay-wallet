'use strict';

angular.module('copayApp.directives')
  .directive('addressSelector', function($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'views/includes/addressSelector.html',
      transclude: true,
      scope: {
        title: '=addressSelectorTitle',
        show: '=addressSelectorShow',
        zAddresses: '=addressSelectorAddresses',
        selectedZAddress: '=addressSelectorSelectedAddress',
        onSelect: '=addressSelectorOnSelect'
      },
      link: function(scope, element, attrs) {
        scope.hide = function() {
          scope.show = false;
        };
        scope.selectZAddress = function(address) {
          $timeout(function() {
            scope.hide();
          }, 100);
          scope.onSelect(address);
        };
      }
    };
  });
