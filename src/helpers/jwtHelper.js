var jwt           = require('jsonwebtoken');
var settings      = require('../config/settings');
var logger        = require('../config/logger')();

module.exports = function() {
  return {
        //secret: settings.jwt.secret,
        //expiresIn: settings.jwt.expiresIn,

        createToken: function(user) {
            return jwt.sign(user, settings.jwt.secret, {expiresIn: settings.jwt.expiresIn});
        },

        verifyToken: function(req, res, next) {
            var chain = Promise.resolve();

            chain
                .then(function(){
                    var token = req.headers.authorization;
                    logger.info('[jwtHelper] Validating authentication by token: '+ token);
                    if (!token || token === ''){
                        logger.error('[jwtHelper] The token does not exist or is empty');
                        throw {code: 403, message: 'The token does not exist or is empty'};
                    } else {
                        token = token.split(' ');
                        if (!token.length === 2) {
                            throw {code: 403, message: 'The token is badly formatted'};
                        }
                        return token[1];
                    }
                })
                .then(function(token){
                    jwt.verify(token, settings.jwt.secret, function(error, decoded){
                        if (error){
                            throw error;
                        }
                        logger.info('[jwtHelper] The token is valid with payload token: ' + JSON.stringify(decoded));
                        next();
                    });
                })
                .catch(function(error){
                    logger.error('[jwtHelper] An error occurred: ' + JSON.stringify(error));
                    if (error.code || error.code === 403){
                        res.status(403).json({});
                    }
                    if (error.message || error.message === 'invalid token'){
                        res.status(403).json({});
                    };
                });
        },

        decodedToken: function(token){
            return jwt.verify(token, settings.jwt.secret, function(error, decoded){
                if (error){
                    throw error;
                }
                return decoded;
            });
        }
    };
};
