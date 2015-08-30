(function (angular) {

  'use strict';

  angular.module('scrum-dashboard-board').filter('storyStatusName', storyStatusNameFilter);

  function storyStatusNameFilter () {
    return storyStatusName;

    function storyStatusName (name) {
      switch(name) {
      case 'TODO':        return 'Todo';
      case 'IN_PROGRESS': return 'In progress';
      case 'COMPLETE':    return 'Complete';
      default:            return 'Unknown';
      }
    }
  }

})(window.angular);