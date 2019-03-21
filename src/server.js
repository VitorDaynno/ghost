const http = require('http');
const runner = require('./runner');
const app = require('./config/express')();
require('./config/database.js')();

const server = http.createServer(app).listen(app.get('port'), () => {
    console.log(`Express is running on port now ${app.get('port')}`);
    runner.monitoring();
});

module.exports = server;
