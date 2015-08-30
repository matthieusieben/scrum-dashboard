(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-api').factory('Sprint', SprintFactory);

  function SprintFactory($resource) {
    return $resource('/api/v1/sprint/:sprintId', {
      sprintId: '@id',
    });
  }

})(window.angular);