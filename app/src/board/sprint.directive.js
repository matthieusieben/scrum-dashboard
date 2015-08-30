(function (angular) {

  'use strict';

  angular.module('scrum-dashboard-board').directive('scrumSprint', scrumSprintDirective);

  function scrumSprintDirective () {
    return {
      templateUrl: 'src/board/sprint.directive.html',
      scope: {
        sprint: '=scrumSprint',
      }
    };
  }

})(window.angular);