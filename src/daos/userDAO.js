var logger = require('../config/logger')();

module.exports = function(dependencies) {
    var userModel = dependencies.user;

    return {
        dependencies: dependencies,

        save: function(user){
            return new Promise(function(resolve, reject){
                logger.info('[UserDAO] Creating user: ' + JSON.stringify(user));
                userModel.create(user)
                    .then(function(user){
                        logger.info('[UserDAO] A user was created: ' + JSON.stringify(user));
                        resolve(user);
                    })
                    .catch(function(error){
                        logger.error('[UserDAO] A error occurred: ' + error);
                        reject(error);
                    });
            });
        },

        getAll: function(filter){
            return new Promise(function(resolve, reject){
                logger.info('[UserDAO] Finding user by filter ' + JSON.stringify(filter));
                userModel.find(filter)
                    .exec()
                    .then(function(user) {
                        logger.info('[UserDAO] A user returned: ' + JSON.stringify(user));
                        resolve(user);
                    });
            });
        },

        getById: function(id){
            return new Promise(function(resolve, reject){
                logger.info('[UserDAO] Finding user by id ' + JSON.stringify(id));
                userModel.findById(id)
                    .exec()
                    .then(function(user) {
                        logger.info('[UserDAO] A user returned: ' + JSON.stringify(user));
                        resolve(user);
                    })
                    .catch(function(error){
                        logger.error('[UserDAO] An error occurred: ' + error);
                        if (error.name === 'CastError' || error.name === 'ValidatorError'){
                            reject({code: 422, message: error.message});
                        } else {
                            reject({code: 500, message: error.message});
                        };
                    });
            });
        },

        update: function(id, user) {
            return new Promise(function(resolve, reject){
                logger.info('[UserDAO] Updating user by id ' + id);
                if (!id || id === ''){
                    logger.error('[UserDAO] Id is empty');
                    reject();
                }
                if (Object.keys(user).length === 0){
                    logger.error('[UserDAO] user is empty');
                    reject();
                }
                userModel.findByIdAndUpdate(id, {$set: user}, {new: true})
                    .then(function(user){
                        logger.info('[UserDAO] User updated by id ' + id);
                        resolve(user);
                    })
                    .catch(function(error){
                        logger.error('[UserDAO] An error occurred: ', error);
                        if (error.name === 'CastError' || error.name === 'ValidatorError'){
                            reject({code: 422, message: error.message});
                        } else {
                            reject({code: 500, message: error.message});
                        };
                    });
            });
        },

        delete: function(id, user) {
            return new Promise(function(resolve, reject){
                logger.info('[UserDAO] Deleting user by id ' + id);
                if (!id || id === ''){
                    logger.error('[UserDAO] Id is empty');
                    reject();
                }
                userModel.update({_id: id}, user)
                    .then(function(user){
                        logger.info('[UserDAO] User deleted by id ' + id);
                        resolve(user);
                    })
                    .catch(function(error){
                        logger.error('[UserDAO] An error occurred: ', error);
                        if (error.name === 'CastError' || error.name === 'ValidatorError'){
                            reject({code: 422, message: error.message});
                        } else {
                            reject({code: 500, message: error.message});
                        };
                    });
            });
        }
    };
};
