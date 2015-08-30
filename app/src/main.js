(function(angular) {

  'use strict';

  angular.module('scrum-dashboard', [
    'ngRoute',
    'scrum-dashboard-board',
  ]).config(scrumDashboardConfig);

  function scrumDashboardConfig($routeProvider) {

    $routeProvider.otherwise('/');
    $routeProvider.when('/', { redirectTo: '/board' });

  }

})(window.angular);