(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-board', [
    'ngDraggable',
    'ngRoute',
    'scrum-dashboard-api',
    'ui.bootstrap',
  ]).config(scrumDashboardBoardConfig);

  function scrumDashboardBoardConfig($routeProvider) {

    $routeProvider.when('/board', {
      controller: 'BoardController',
      controllerAs: 'board',
      templateUrl: 'src/board/board.controller.html',
    });

  }

})(window.angular);