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
                    logger.error(`[ResourceDAO] A error occurred: ${error}`);
                    reject(error);
                });
        });
    }

    getAll(filter) {
        this.filter = filter;
        this.filter.isEnabled = true;
        return new Promise((resolve) => {
            logger.info(`[ResourceDAO] Finding resource by filter ${JSON.stringify(filter)}`);
            this.resourceModel.find(this.filter)
                .exec()
                .then((resource) => {
                    logger.info(`[ResourceDAO] A resource returned: ${JSON.stringify(resource)}`);
                    resolve(resource);
                });
        });
    }

    getById(id) {
        this.id = id;
        return new Promise((resolve, reject) => {
            logger.info(`[ResourceDAO] Finding resource by id ${JSON.stringify(id)}`);
            this.resourceModel.findById(id)
                .exec()
                .then((resource) => {
                    logger.info(`[ResourceDAO] A resource returned: ${JSON.stringify(resource)}`);
                    resolve(resource);
                })
                .catch((error) => {
                    logger.error(`[ResourceDAO] An error occurred: ${error}`);
                    if (error.name === 'CastError' || error.name === 'ValidatorError') {
                        reject({ code: 422, message: error.message });
                    } else {
                        reject({code: 500, message: error.message});
                    }
                });
        });
    }

    update(id, resource) {
        this.id = id;
        resource.modificationDate = new Date();
        this.resource = resource;
        return new Promise((resolve, reject) => {
            logger.info(`[ResourceDAO] Updating resource by id ${id}`);
            if (!id || id === '') {
                logger.error('[ResourceDAO] Id is empty');
                const error = { code: 422, message: 'Id is empty' };
                throw error;
            }
            if (Object.keys(resource).length === 0) {
                logger.error('[ResourceDAO] Resource is empty');
                const error = { code: 422, message: 'Resource is empty' };
                throw error;
            }
            this.resourceModel.findByIdAndUpdate(id, { $set: resource }, { new: true })
                .then((updatedResource) => {
                    logger.info(`[ResourceDAO] Resource updated by id ${id}`);
                    resolve(updatedResource);
                })
                .catch((error) => {
                    logger.error('[ResourceDAO] An error occurred: ', error);
                    if (error.name === 'CastError' || error.name === 'ValidatorError') {
                        reject({code: 422, message: error.message});
                    } else {
                        reject({code: 500, message: error.message});
                    }
                });
        });
    }

    delete(id, resource) {
        this.id = id;
        this.resource = resource;
        return new Promise((resolve, reject) => {
            logger.info(`[ResourceDAO] Deleting resource by id ${id}`);
            if (!id || id === '') {
                logger.error('[ResourceDAO] Id is empty');
                reject();
            }
            this.resourceModel.update({ _id: id }, resource)
                .then((resource) => {
                    logger.info(`[ResourceDAO] Resource deleted by id ${id}`);
                    resolve(resource);
                })
                .catch((error) => {
                    logger.error('[ResourceDAO] An error occurred: ', error);
                    if (error.name === 'CastError' || error.name === 'ValidatorError') {
                        reject({code: 422, message: error.message});
                    } else {
                        reject({code: 500, message: error.message});
                    }
                });
        });
    }
}

module.exports = ResourceDAO;
