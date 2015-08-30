(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-board').controller('StoryCreateController', StoryCreateController);

  function StoryCreateController() {
    var vm = this;

    vm.data = {
      points: 1,
      title: '',
      description: '',
      addToSprint: false,
    };
  }

})(window.angular);