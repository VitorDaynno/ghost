var mongoose = require('mongoose');

var model = null;

module.exports = function () {

    var user = mongoose.Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        creationDate: {
            type: Date,
            required: true
        },
        modificationDate: {
            type: Date,
            required: false
        },
        exclusionDate: {
            type: Date,
            required: false
        },
        isEnabled: {
            type: Boolean,
            required: true
        }
    });

    model = model ? model : mongoose.model('Users', user);

    return model;
};
