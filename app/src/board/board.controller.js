(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-board').controller('BoardController', BoardController);

  function BoardController($log, $modal, $q, $scope, Sprint, Story) {

    var vm = this;

    vm.loading = true;
    vm.addStory = addStory;
    vm.createStory = createStory;
    vm.updateStatus = updateStatus;
    vm.STATUS = Story.STATUS;

    // Load current sprint
    Sprint.get({ sprintId: 'current' }).$promise.then(function (sprint) {
      vm.sprint = sprint;
      // Load current sprint stories
      return Story.query({ sprint: sprint.id }).$promise.then(function (stories) {
        vm.stories = stories;
      });
    }).catch(errorHandler).then(function () {
      vm.loading = false;
    });

    return;

    // Functions definition

    function updateStatus (story, newStatus) {
      if (story.status !== newStatus) {
        vm.loading = true;

        var initialStatus = story.status;

        story.status = newStatus;
        story.$save().catch(function (reason) {
          story.status = initialStatus;
          errorHandler(reason);
        }).then(function () {
          vm.loading = false;
        });
      }
    }

    function addStory () {
      $modal.open({
        templateUrl: 'src/board/story-select.modal.html',
        controller: 'StorySelectController',
        controllerAs: 'vm',
        // Load unplanned stories
        // https://github.com/angular-ui/bootstrap/issues/4309
        /* resolve: {
          _stories: Story.query({ sprint: '', status: Story.STATUS.TODO }).$promise,
        }, */
      }).result.then(function (story) {
        story.sprint = vm.sprint.id;
        return story.$save().then(function () {
          vm.stories.push(story);
        }, errorHandler);
      });
    }

    function createStory () {
      $modal.open({
        templateUrl: 'src/board/story-create.modal.html',
        controller: 'StoryCreateController',
        controllerAs: 'vm',
        scope: $scope,
      }).result.then(function (data) {
        var story = new Story(data);
        story.sprint = vm.sprint.id;
        return story.$save().then(function () {
          vm.stories.push(story);
        });
      }).catch(errorHandler);
    }

    function errorHandler (reason) {
      if (reason) {
        // @todo : create a listener on rootScope that displays these messages in an ephemaral dialog
        $scope.$emit('error', reason);
      }
    }
  }

})(window.angular);