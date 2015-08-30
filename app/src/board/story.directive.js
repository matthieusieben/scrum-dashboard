(function (angular) {

  'use strict';

  angular.module('scrum-dashboard-board').directive('scrumStory', scrumStoryDirective);

  function scrumStoryDirective () {
    return {
      templateUrl: 'src/board/story.directive.html',
      controller: scrumStoryController,
      controllerAs: 'vm',
      scope: {
        story: '=scrumStory',
      }
    };

    function scrumStoryController (Story) {
      var vm = this;

      vm.STATUS = Story.STATUS;
    }
  }

})(window.angular);