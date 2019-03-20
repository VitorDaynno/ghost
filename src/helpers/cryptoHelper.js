var crypto = require('crypto');
var settings = require('../config/settings');

module.exports = {
    encrypt: function(text) {
        var hash = crypto.createHmac('sha256', settings.crypto.secret)
                    .update(text)
                    .digest('hex');
        return hash;
    }
};
