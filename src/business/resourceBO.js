const logger = require('../config/logger')();

class ResourceBO {
    constructor(dependencies) {
        this.dao = dependencies.resourceDAO;
        this.modelHelper = dependencies.modelHelper;
        this.dateHelper = dependencies.dateHelper;
    }

    getById(body) {
        this.body = body;
        return new Promise((resolve, reject) => {
            const chain = Promise.resolve();
            chain
                .then(() => {
                    if (!body || !body.id) {
                        logger.error('[ResourceBO] An error occurred because body or field id not exist');
                        const error = { code: 422, message: 'Id are required' };
                        throw error;
                    }
                })
                .then(() => {
                    logger.info(`[ResourceBO] Getting resource by id:  ${body.id}`);
                    return this.dao.getById(body.id);
                })
                .then((resource) => {
                    if (!resource || !resource._id) {
                        logger.error(`[ResourceBO] Resource not found by id: ${body.id}`);
                        return {};
                    }
                    logger.info('[ResourceBO] Parse resource: ', resource);
                    return this.modelHelper.parseResource(resource);
                })
                .then((resource) => {
                    resolve(resource);
                })
                .catch((error) => {
                    logger.error('[ResourceBO] An error occurred: ', error);
                    reject(error);
                });
        });
    }

    save(body) {
        this.body = body;
        return new Promise((resolve, reject) => {
            const chain = Promise.resolve();
            chain
                .then(() => {
                    if (!body || !body.name) {
                        logger.error(`[ResourceBO] Name not found in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'name are required' };
                        throw error;
                    }
                    if (!body.type) {
                        logger.error(`[ResourceBO] Type not found in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'type are required' };
                        throw error;
                    }
                    if (!body.data) {
                        logger.error(`[ResourceBO] Data not found in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'data are required' };
                        throw error;
                    }
                    if (!body.status) {
                        logger.error(`[ResourceBO] Status not found in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'status are required' };
                        throw error;
                    }
                    if (!['database', 'server', 'service'].includes(body.type)) {
                        logger.error(`[ResourceBO] Type not valid in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'type is invalid' };
                        throw error;
                    }
                    if (!['on', 'off'].includes(body.status)) {
                        logger.error(`[ResourceBO] Status not valid in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'status is invalid' };
                        throw error;
                    }
                })
                .then(() => {
                    logger.info('[ResourceBO] Saving resource in database');
                    const resource = {};
                    resource.name = body.name;
                    resource.type = body.type;
                    resource.data = body.data;
                    resource.status = body.status;
                    resource.isEnabled = true;
                    resource.creationDate = this.dateHelper.now();
                    return this.dao.save(resource);
                })
                .then((resource) => {
                    logger.info(`[ResourceBO] Resource "${JSON.stringify(resource)}" save in database with success`);
                    return this.modelHelper.parseResource(resource);
                })
                .then((resource) => {
                    logger.info(`[ResourceBO] Resource parsed by helper: ${JSON.stringify(resource)}`);
                    resolve(resource);
                })
                .catch((error) => {
                    logger.error(`[ResourceBO] An error occured: ${error}`);
                    reject(error);
                });
        });
    }

    update(body) {
        this.body = body;
        return new Promise((resolve, reject) => {
            const chain = Promise.resolve();
            chain
                .then(() => {
                    logger.info(`[ResourceBO] Validating resource: ${JSON.stringify(body)}`);
                    if (!body || !body.id) {
                        logger.error(`[ResourceBO] Id not found in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'Id are required' };
                        throw error;
                    }
                })
                .then(() => {
                    logger.info('[ResourceBO] Updating resource: ', body.id);
                    const resource = {};
                    if (body.name || body.name !== '') {
                        resource.name = body.name;
                        resource.modificationDate = this.dateHelper.now();
                    }
                    return this.dao.update(body.id, resource);
                })
                .then((resource) => {
                    logger.info('[ResourceBO] Resource updated: ', resource);
                    if (!resource || !resource._id) {
                        return {};
                    }
                    return this.modelHelper.parseResource(resource);
                })
                .then((resource) => {
                    logger.info('[ResourceBO] The resource parsed: ', resource);
                    resolve(resource);
                })
                .catch((error) => {
                    logger.error(`[ResourceBO] An error occurred: ${JSON.stringify(error)}`);
                    reject(error);
                });
        });
    }

    delete(body) {
        this.body = body;
        return new Promise((resolve, reject) => {
            const chain = Promise.resolve();
            chain
                .then(() => {
                    logger.info('[ResourceBO] Delete resource');
                    if (!body || !body.id) {
                        logger.error(`[ResourceBO] Id not found in ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'Id are required' };
                        throw error;
                    }
                })
                .then(() => {
                    logger.info('[ResourceBO] Delete resource by id: ', body.id);
                    const resource = {};
                    resource.isEnabled = false;
                    resource.exclusionDate = this.dateHelper.now();
                    return this.dao.delete(body.id, resource);
                })
                .then(() => {
                    resolve({});
                })
                .catch((error) => {
                    logger.error(`[ResourceBO] An error occurred: ${JSON.stringify(error)}`);
                    reject(error);
                });
        });
    }
}

module.exports = ResourceBO;
