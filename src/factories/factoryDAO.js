const UserDAO = require('../daos/userDAO');
const userModel = require('../models/user')();
const ResourceDAO = require('../daos/resourceDAO');
const resourceModel = require('../models/resource')();

module.exports = {
    getDAO: (dao) => {
        switch (dao) {
        case 'user':
            return new UserDAO({
                user: userModel,
            });
        case 'resource':
            return new ResourceDAO({
                resource: resourceModel,
            });
        default:
            return null;
        }
    },
};
