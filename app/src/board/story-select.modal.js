(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-board').controller('StorySelectController', StorySelectController);

  function StorySelectController($modalInstance, _stories) {
    var vm = this;

    vm.stories = _stories;
  }

})(window.angular);