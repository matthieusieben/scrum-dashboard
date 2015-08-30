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
    title: 'Initially planned story A',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: STORY_STATUS.IN_PROGRESS,
    sprint: 0,
    points: 1,
  };

  stories[1] = {
    id: 1,
    title: 'Initially planned story B',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: STORY_STATUS.TODO,
    sprint: 0,
    points: 2,
  };

  stories[2] = {
    id: 2,
    title: 'Initially not planned story',
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: STORY_STATUS.TODO,
    sprint: null,
    points: 2,
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
              case 'object':
                if (story[name] === null && request.query[name]) {
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
