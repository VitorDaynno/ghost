const mongoose = require('mongoose');

let model = null;

module.exports = () => {
    const resource = mongoose.Schema({
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['database', 'server', 'service'],
        },
        data: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            required: true,
            enum: ['on', 'off'],
        },
        creationDate: {
            type: Date,
            required: true,
        },
        modificationDate: {
            type: Date,
            required: false,
        },
        exclusionDate: {
            type: Date,
            required: false,
        },
        isEnabled: {
            type: Boolean,
            required: true,
        },
    });

    model = model ? model : mongoose.model('Resources', resource);

    return model;
};
