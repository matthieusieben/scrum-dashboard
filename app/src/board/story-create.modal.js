(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-board').controller('StoryCreateController', StoryCreateController);

  function StoryCreateController() {
    var vm = this;

    vm.data = {};
  }

})(window.angular);