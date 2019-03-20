var express     = require('express');
var load        = require('express-load');
var bodyParser  = require('body-parser');
var appSettings = require('./settings');

module.exports = function () {
    var app = express();
    app.set('port', appSettings.servicePort);

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(require('method-override')());


    app.use(function (req, res, next){
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        next();
    });

    load('controllers', {cwd:'src/api'})
        .then('routes')
        .into(app);

    console.log('app');

    return app;
};
