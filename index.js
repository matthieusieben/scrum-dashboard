var Hapi = require('hapi');
var Path = require('path');

var server = new Hapi.Server();

server.connection({
	port: process.env.PORT || 3000,
});

server.register(require('./api'), function (err) {
  if (err) {
    throw err;
  }
});

server.register(require('./app'), function (err) {
  if (err) {
    throw err;
  }
});

server.start(function() {
  console.log('Server running at:', server.info.uri);
});