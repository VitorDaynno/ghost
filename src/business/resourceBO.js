const logger = require('../config/logger')();

class ResourceBO {
    constructor(dependencies) {
        this.dao = dependencies.resourceDAO;
        this.jwt = dependencies.jwtHelper;
        this.modelHelper = dependencies.modelHelper;
        this.cryptoHelper = dependencies.cryptoHelper;
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
                    if (!body || !body.email) {
                        logger.error(`[ResourceBO] Email not found in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'Email are required' };
                        throw error;
                    }
                    if (!body.name) {
                        logger.error(`[ResourceBO] Name not found in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'Name are required' };
                        throw error;
                    }
                    if (!body.password) {
                        logger.error(`[ResourceBO] Password not found in: ${JSON.stringify(body)}`);
                        const error = { code: 422, message: 'Password are required' };
                        throw error;
                    }
                })
                .then(() => {
                    logger.info(`[ResourceBO] Validating a email "${body.email}" in database`);
                    return this.dao.getAll({ email: body.email, isEnabled: true });
                })
                .then((resource) => {
                    if (resource && resource.length > 0) {
                        logger.error(`[ResourceBO] The email "${resource.email}" is already in the database`);
                        const error = { code: 409, message: 'Entered email is already being used' };
                        throw error;
                    }
                })
                .then(() => {
                    logger.info(`[ResourceBO] Encrypting a password of ${body.name}`);
                    return this.cryptoHelper.encrypt(body.password);
                })
                .then((password) => {
                    logger.info('[ResourceBO] Saving resource in database');
                    const resource = {};
                    resource.name = body.name;
                    resource.email = body.email;
                    resource.password = password;
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
