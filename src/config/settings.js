const util = require('util');

module.exports = {
    mongoUrl: util.format('mongodb://%s/ghost', process.env.DB || 'localhost'),
    servicePort: process.env.PORT || 5000,
    isMongoDebug: true,
    jwt: {
        secret: process.env.SECRET || 'secret-key',
        expiresIn: 4000,
    },
    crypto: {
        secret: process.env.SECRETKEY || 'secret-key',
    },
};
