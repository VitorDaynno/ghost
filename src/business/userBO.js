var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var dao = dependencies.userDAO;
    var jwt = dependencies.jwtHelper;
    var modelHelper = dependencies.modelHelper;
    var cryptoHelper = dependencies.cryptoHelper;
    var dateHelper = dependencies.dateHelper;

    return {
        dependencies:dependencies,

        auth: function(body){
            return new Promise(function(resolve, reject){
                if (!body.email || !body.password){
                    logger.error('[UserBO] An error occurred because email or password not exist');
                    reject({code:422, message:'Email and password are required'});
                } else {
                    var chain = Promise.resolve();
                    chain
                        .then(function(){
                            return cryptoHelper.encrypt(body.password);
                        })
                        .then(function(password){
                            logger.info('[UserBO] Get user by email ' + body.email);
                            return dao.getAll({email: body.email, password: password, isEnabled: true});
                        })
                        .then(function(user){
                            logger.info('[UserBO] The user are returned: ' + JSON.stringify(user));
                            if (user.length > 0){
                                return user[0];
                            } else {
                                logger.error('[UserBO] Email or password are incorrect');
                                throw {code: 401, message: 'Email or password are incorrect'};
                            };
                        })
                        .then(function(user){
                            return modelHelper.parseUser(user);
                        })
                        .then(function(user){
                            token = jwt.createToken(user);
                            user.token = token;
                            resolve(user);
                        })
                        .catch(function(error){
                            logger.error('[UserBO] An error occurred: ', error);
                            reject(error);
                        });
                };
            });
        },

        getById: function(body){
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!body || !body.id){
                            logger.error('[UserBO] An error occurred because body or field id not exist');
                            throw {code: 422, message: 'Id are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[UserBO] Getting user by id: '+ body.id);
                        return dao.getById(body.id);
                    })
                    .then(function(user){
                        if (!user || !user._id){
                            logger.error('[UserBO] User not found by id: ' + body.id);
                            return {};
                        } else {
                            logger.info('[UserBO] Parse user: ', user);
                            return modelHelper.parseUser(user);
                        }
                    })
                    .then(function(user){
                        resolve(user);
                    })
                    .catch(function(error){
                        logger.error('[UserBO] An error occurred: ', error);
                        reject(error);
                    });
            });
        },

        save: function(body){
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        if (!body || !body.email){
                            logger.error('[UserBO] Email not found in: ' + JSON.stringify(body));
                            throw {code: 422, message: 'Email are required'};
                        }
                        if (!body.name){
                            logger.error('[UserBO] Name not found in: ' + JSON.stringify(body));
                            throw {code: 422, message: 'Name are required'};
                        }
                        if (!body.password){
                            logger.error('[UserBO] Password not found in: ' + JSON.stringify(body));
                            throw {code: 422, message: 'Password are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[UserBO] Validating a email "' + body.email +'" in database ');
                        return dao.getAll({email: body.email, isEnabled: true});
                    })
                    .then(function(user){
                        if (user && user.length > 0){
                            logger.error('[UserBO] The email "' + user.email + '" is already in the database');
                            throw {code: 409, message: 'Entered email is already being used'};
                        }
                    })
                    .then(function(){
                        logger.info('[UserBO] Encrypting a password of ' + body.name);
                        return cryptoHelper.encrypt(body.password);
                    })
                    .then(function(password){
                        logger.info('[UserBO] Saving user in database');
                        var user = {};
                        user.name = body.name;
                        user.email = body.email;
                        user.password = password;
                        user.isEnabled = true;
                        user.creationDate = dateHelper.now();
                        return dao.save(user);
                    })
                    .then(function(user){
                        logger.info('[UserBO] User "'+ JSON.stringify(user) +'" save in database with success');
                        return modelHelper.parseUser(user);
                    })
                    .then(function(user){
                        logger.info('[UserBO] User parsed by helper: '+ JSON.stringify(user));
                        resolve(user);
                    })
                    .catch(function(error){
                        logger.error('[UserBO] An error occured: ' + error);
                        reject(error);
                    });
            });
        },

        update: function(body){
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        logger.info('[UserBO] Validating user: '+ JSON.stringify(body));
                        if (!body || !body.id){
                            logger.error('[UserBO] Id not found in: '+ JSON.stringify(body));
                            throw {code: 422, message: 'Id are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[UserBO] Updating user: ', body.id);
                        var user = {};
                        if (body.name || body.name !== ''){
                            user.name = body.name;
                            user.modificationDate= dateHelper.now();
                        }
                        return dao.update(body.id, user);
                    })
                    .then(function(user){
                        logger.info('[UserBO] User updated: ', user);
                        if (!user || !user._id) {
                            return {};
                        }
                        return modelHelper.parseUser(user);
                    })
                    .then(function(user){
                        logger.info('[UserBO] The user parsed: ', user);
                        resolve(user);
                    })
                    .catch(function(error){
                        logger.error('[UserBO] An error occurred: ' + JSON.stringify(error));
                        reject(error);
                    });
            });
        },

        delete: function(body){
            return new Promise(function(resolve, reject){
                var chain = Promise.resolve();
                chain
                    .then(function(){
                        logger.info('[UserBO] Delete user');
                        if (!body || !body.id){
                            logger.error('[UserBO] Id not found in ' + JSON.stringify(body));
                            throw {code: 422, message: 'Id are required'};
                        }
                    })
                    .then(function(){
                        logger.info('[UserBO] Delete user by id: ', body.id);
                        var user = {};
                        user.isEnabled = false;
                        user.exclusionDate = dateHelper.now();
                        return dao.delete(body.id, user);
                    })
                    .then(function(){
                        resolve({});
                    })
                    .catch(function(error){
                        logger.error('[UserBO] An error occurred: ' + JSON.stringify(error));
                        reject(error);
                    });
            });
        }
    };
};
