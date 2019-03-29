const logger = require('../../config/logger')();
const BOFactory = require('../../factories/factoryBO');

module.exports = () => {
    const business = BOFactory.getBO('resource');

    return {
        getById: (req, res) => {
            logger.info(`[Resource-Controller] Getting resource by id ${req.params.id}`);
            const id = req.params.id ? req.params.id : null;
            business.getById({ id })
                .then((resource) => {
                    res.send(resource);
                })
                .catch((error) => {
                    res.status(error.code).json(error.message);
                });
        },

        save: (req, res) => {
            logger.info('[Resource-Controller] Save a resource');
            const body = req.body ? req.body : {};
            business.save(body)
                .then((resource) => {
                    res.status(201).json(resource);
                })
                .catch((error) => {
                    res.status(error.code).json(error.message);
                });
        },

        update: (req, res) => {
            logger.info(`[Resource-Controller] updating resource by id ${req.params.id}`);
            const id = req.params.id ? req.params.id : null;
            const body = req.body ? req.body : {};
            body.id = id;
            business.update(body)
                .then((resource) => {
                    res.send(resource);
                })
                .catch((error) => {
                    res.status(error.code).json(error.message);
                });
        },

        delete: (req, res) => {
            logger.info(`[Resource-Controller] Deleting resource by id ${req.params.id}`);
            const id = req.params.id ? req.params.id : null;
            business.delete({ id })
                .then((resource) => {
                    res.send(resource);
                })
                .catch((error) => {
                    res.status(error.code).json(error.message);
                });
        },

        getAll(req, res) {
            logger.info('[Resource-Controller] Getting resources');
            business.getAll()
                .then((resources) => {
                    res.status(200).send(resources);
                })
                .catch((error) => {
                    res.status(error.code).json(error.message);
                });
        },
    };
};
