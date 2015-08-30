exports.register = function (server, options, next) {

  server.register(require('inert'), function (err) {
    if (err) {
      throw err;
    }

    // Redirect '/' requests to the app
    server.route({
      method: 'GET',
      path: '/',
      handler: function(request, reply) {
        return reply.redirect('/app');
      },
      config: {
        tags: [ 'static' ],
        description: 'WebApp index (redirects to /app).',
      },
    });

    // Serve the app
    server.route({
      method: 'GET',
      path: '/app/{file*}',
      handler: {
        directory: {
          path: 'app'
        }
      },
      config: {
        tags: [ 'static' ],
        description: 'WebApp static files.',
      },
    });
  });

  return next();
};

exports.register.attributes = {
  name: 'scrum-dashboard-app',
  version: '0.0.1',
};
