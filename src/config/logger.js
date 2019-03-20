var winston = require('winston');

module.exports = function(){
  var logger = winston.createLogger({
    format: winston.format.combine(winston.format.simple()),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({filename: 'error.log', level: 'error'})
    ]
  });

  return logger;
};
