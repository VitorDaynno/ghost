var mongoose    = require('mongoose');
var logger      = require('./logger')();
var settings    = require('./settings');
var Promise     = require('promise');

module.exports = function(){
  mongoose.connect(settings.mongoUrl);
  mongoose.Promise = Promise;
  mongoose.set('debug', settings.isMongoDebug);

  mongoose.connection.on('connected', function() {
    logger.info('Mongoose! Connected at ' + settings.mongoUrl);
  });

  mongoose.connection.on('disconnected', function() {
    logger.info('Mongoose! Disconnected em ' + settings.mongoUrl);
  });

  mongoose.connection.on('error', function(erro) {
    logger.error('Mongoose! Error : ' + erro);
  });

  process.on('SIGINT', function() {
    mongoose.connection.close(function() {
      logger.info('Mongoose! Disconnected by the application');
      process.exit(0);
    });
  });
};
