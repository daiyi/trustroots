(function () {
  'use strict';

  angular
    .module('core')
    .controller('HeaderController', HeaderController);

  /* @ngInject */
  function HeaderController($scope, $state) {

    // ViewModel
    var vm = this;

    // Exposed
    vm.$state = $state;
    vm.isCollapsed = false;
    vm.isHidden = false;
    vm.toggleCollapsibleMenu = toggleCollapsibleMenu;

    function toggleCollapsibleMenu() {
      vm.isCollapsed = !vm.isCollapsed;
    }

    activate();

    function activate() {

      // Perform actions at page change
      $scope.$on('$stateChangeSuccess', function(event, toState) {

        // Collapsing the menu after navigation
        vm.isCollapsed = false;

        // Hide header at certain pages
        vm.isHidden = (angular.isDefined(toState.headerHidden) && toState.headerHidden === true);
      });
    }

  }

}());
