exports.register = function (server, options, next) {

  server.register({
    register: require('./v1')
  }, {
    routes: {
      prefix: '/api/v1',
    }
  }, function (err) {
    if (err) {
      throw err;
    }
  });

  // Routes docs generator '/docs'
  server.register({
    register: require('vision')
  }, function (err) {
    if (err) {
      throw err;
    }

    server.register({
      register: require('lout')
    }, function(err) {
      if (err) {
        throw err;
      }
    });
  });

  return next();
};

exports.register.attributes = {
  name: 'scrum-dashboard-api',
  version: '0.0.1',
};
