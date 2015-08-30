(function(angular) {

  'use strict';

  angular.module('scrum-dashboard-api').factory('Story', StoryFactory);

  function StoryFactory($resource) {
    var Story = $resource('/api/v1/story/:storyId', {
      storyId: '@id',
    });

    Story.STATUS = {
      TODO: 0,
      IN_PROGRESS: 1,
      COMPLETE: 2,
    };

    return Story;
  }

})(window.angular);