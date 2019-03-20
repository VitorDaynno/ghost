const DAOFactory = require('./factoryDAO');
const UserBO = require('../business/userBO');
const ResourceBO = require('../business/resourceBO');
const JWTHelper = require('../helpers/jwtHelper');
const ModelHelper = require('../helpers/modelHelper');
const DateHelper = require('../helpers/dateHelper');
const CryptoHelper = require('../helpers/cryptoHelper');

const jwtHelper = new JWTHelper();

function factory(business) {
    switch (business) {
    case 'user':
        return new UserBO({
            userDAO: DAOFactory.getDAO('user'),
            jwtHelper,
            modelHelper: ModelHelper,
            cryptoHelper: CryptoHelper,
            dateHelper: DateHelper,
        });
    case 'resource':
        return new ResourceBO({
            resourceDAO: DAOFactory.getDAO('resource'),
            jwtHelper,
            modelHelper: ModelHelper,
            cryptoHelper: CryptoHelper,
            dateHelper: DateHelper,
        });
    default:
        return null;
    }
}

module.exports = { getBO: factory };
