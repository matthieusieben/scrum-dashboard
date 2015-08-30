var Boom = require('boom');
var Joi = require('joi');

exports.register = function (server, options, next) {

  var STORY_STATUS = {
    TODO: 0,
    IN_PROGRESS: 1,
    COMPLETE: 2,
  }

  // Create in memory data stores and the related API routes

  var stories = createRestStore('story');
  var sprints = createRestStore('sprint');

  server.route({
    method: 'GET',
    path: '/sprint/current',
    handler: function (request, reply) {
      var now = new Date();
      for (var sprintId in sprints) {
        var sprint = sprints[sprintId];
        var startDate = parseDate(sprint.startDate);
        var endDate = parseDate(sprint.endDate);
        if (startDate && endDate && startDate < now && now < endDate) {
          return reply(sprint);
        }
      }
      return reply(Boom.notFound());
    },
    config: {
      description: 'Get the current strum sprint based on the start/end dates.',
    },
  });

  sprints[0] = {
    id: 0,
    startDate: (function() {
      var date = new Date();
      date.setDate(date.getDate() - 1);
      return date.toString();
    })(),
    endDate: (function() {
      var date = new Date();
      date.setDate(date.getDate() + 15);
      return date.toString();
    })(),
  };

  stories[0] = {
    id: 0,
    title: 'Allow insterface translation',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 2,
  };

  stories[1] = {
    id: 1,
    title: 'Fix date filter in "scrumSprint" directive',
    status: STORY_STATUS.IN_PROGRESS,
    sprint: 0,
    points: 1,
  };

  stories[2] = {
    id: 2,
    title: 'Add user management system',
    status: STORY_STATUS.TODO,
    sprint: 0,
    points: 5,
  };

  stories[3] = {
    id: 3,
    title: 'Add burndown chart',
    status: STORY_STATUS.TODO,
    sprint: 0,
    points: 3,
  };

  stories[4] = {
    id: 4,
    title: 'Validate user input (server side)',
    status: STORY_STATUS.TODO,
    sprint: 0,
    points: 3,
  };

  stories[5] = {
    id: 5,
    title: 'Use Mongo DB',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 3,
  };

  stories[6] = {
    id: 6,
    title: 'Add sprint management interface',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 2,
  };

  stories[7] = {
    id: 7,
    title: 'Create "story details" view',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 2,
  };

  stories[8] = {
    id: 8,
    title: 'Improve story directive',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 2,
  };

  stories[9] = {
    id: 9,
    title: 'Document code properly (ngDocs)',
    status: STORY_STATUS.TODO,
    sprint: 0,
    points: 2,
  };

  stories[10] = {
    id: 10,
    title: 'Grunt/Gulp in order to build a minified version',
    status: STORY_STATUS.TODO,
    sprint: 0,
    points: 2,
  };

  stories[11] = {
    id: 11,
    title: 'Offline mode: create a cache manifest',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 1,
  };

  stories[12] = {
    id: 12,
    title: 'User feedback for errors (popup when "error" emitted on nv-view\'s $scope)',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 1,
  };

  stories[13] = {
    id: 13,
    title: 'Enforce story status flow (todo > in progress > complete)',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 1,
  };

  return next();

  function parseDate (timestamp) {
    if (timestamp) {
      var date = new Date(timestamp);
      if (!isNaN(date.getFullYear())) {
        return date;
      }
    }
  }

  function createRestStore (storeName) {

    var nextItemId = 1;
    var store = {};

    server.route({
      method: 'GET',
      path: '/' + storeName,
      handler: function (request, reply) {
        return reply(Object.keys(store).map(function (storyId) {
          return store[storyId];
        }).filter(function (story) {
          if (!request.query) {
            return true;
          } else {
            for (var name in request.query) {
              switch(typeof story[name]) {
              case 'number':
                if (story[name] !== parseInt(request.query[name])) {
                  return false;
                }
                break;
              case 'object': // null
              case 'undefined':
                if (!story[name] && request.query[name]) {
                  return false;
                }
                break;
              case 'string':
              default:
                if (story[name] !== request.query[name]) {
                  return false;
                }
                break;
              }
            }
            return true;
          }
        }));
      },
      config: {
        tags: [ 'rest', storeName ],
        description: 'Retrieve all items from the "' + storeName + '" store.',
      },
    });

    server.route({
      method: 'POST',
      path: '/' + storeName,
      handler: function (request, reply) {
        if (typeof request.payload !== 'object') {
          return reply(Boom.badData('Payload expected to be an object.'));
        }
        var story = request.payload;
        story.id = getNextItemId();
        store[story.id] = story;
        return reply(story);
      },
      config: {
        tags: [ 'rest', storeName ],
        description: 'Create a new item in the "' + storeName + '" store.',
      },
    });

    server.route({
      method: 'POST',
      path: '/' + storeName + '/{itemId}',
      handler: function (request, reply) {
        var itemId = parseInt(request.params.itemId);
        var story = store[itemId];

        if (!story) {
          return reply(Boom.notFound());
        } else if (typeof request.payload !== 'object') {
          return reply(Boom.badData('Payload expected to be an object.'));
        }

        for (var name in request.payload) {
          if (name !== 'id') {
            if (request.payload[name] === null) {
              delete story[name];
            } else {
              story[name] = request.payload[name];
            }
          }
        }

        return reply(story);
      },
      config: {
        tags: [ 'rest', storeName ],
        description: 'Update an item from the "' + storeName + '" store.',
      },
    });

    server.route({
      method: 'DELETE',
      path: '/' + storeName + '/{itemId}',
      handler: function (request, reply) {
        var itemId = parseInt(request.params.itemId);
        if (!store[itemId]) {
          return reply(Boom.notFound());
        } else {
          delete store[itemId];
          return reply(true);
        }
      },
      config: {
        tags: [ 'rest', storeName ],
        description: 'Delete an item from the "' + storeName + '" store.',
      },
    });

    server.route({
      method: 'GET',
      path: '/' + storeName + '/{itemId}',
      handler: function (request, reply) {
        var itemId = parseInt(request.params.itemId);
        return reply(store[itemId] || Boom.notFound());
      },
      config: {
        tags: [ 'rest', storeName ],
        description: 'Retrieve an item from the "' + storeName + '" store.',
      },
    });

    return store;

    function getNextItemId() {
      while(store.hasOwnProperty(nextItemId)) {
        nextItemId++;
      }
      return nextItemId;
    }
  }
};

exports.register.attributes = {
  name: 'scrum-dashboard-api-V1',
  version: '0.0.1',
};
