(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-board').controller('StorySelectController', StorySelectController);

  function StorySelectController($modalInstance, Story) {
    var vm = this;

    Story.query({ sprint: '', status: Story.STATUS.TODO }).$promise.then(function (stories) {
      vm.stories = stories;
    });
  }

})(window.angular);