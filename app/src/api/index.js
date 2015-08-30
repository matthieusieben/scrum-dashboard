(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-api', [
    'ngResource',
  ]).config(scrumDashboardApiConfig);

  function scrumDashboardApiConfig($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = true;
  }

})(window.angular);