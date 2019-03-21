const ping = require('ping');
const logger = require('./config/logger')();

const runner = {
    serverMonitoring: function(host){
        logger.info('[Runner] The server Monitoring has started.');
        ping.sys.probe(host, (isAlive) => {
            console.log(isAlive);
            return isAlive;
        });
    },

    monitoring: function() {
        /** TODO 
         * 1- Search from DB the servers on resources
         * 2- Foreach server, execute the serverMonitoring function minute by minute
         * 3- When the serverMonitoring function executes, it has to change the stats of the server on DB(resources)
         */
        this.serverMonitoring('www.google.com.br');
    },

};

module.exports = runner;
