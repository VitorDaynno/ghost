const logger = require('../config/logger')();

class ResourceDAO {
    constructor(dependencies) {
        this.resourceModel = dependencies.resource;
    }

    save(resource) {
        this.resource = resource;
        return new Promise((resolve, reject) => {
            logger.info(`[ResourceDAO] Creating resource: ${JSON.stringify(resource)}`);
            this.resourceModel.create(resource)
                .then((newResource) => {
                    logger.info(`[ResourceDAO] A resource was created: ${JSON.stringify(newResource)}`);
                    resolve(newResource);
                })
                .catch((error) => {
                    logger.error(`[UserDAO] A error occurred: ${error}`);
                    reject(error);
                });
        });
    }

    getAll(filter){
        return new Promise(function(resolve, reject){
            logger.info('[UserDAO] Finding user by filter ' + JSON.stringify(filter));
            userModel.find(filter)
                .exec()
                .then(function(user) {
                    logger.info('[UserDAO] A user returned: ' + JSON.stringify(user));
                    resolve(user);
                });
        });
    }

    getById(id){
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
    }

    update(id, user) {
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
    }

    delete(id, user) {
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
}

module.exports = ResourceDAO;
