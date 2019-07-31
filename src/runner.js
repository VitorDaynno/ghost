const ping = require('ping');
const axios = require('axios');
const logger = require('./config/logger')();
const FatoryDAO = require('./factories/factoryDAO');

const runner = {
    serverMonitoring(resource) {
        return new Promise((resolve, reject) => {
            const chain = Promise.resolve();

            chain
                .then(() => {
                    logger.info('[Runner] The method serverMonitoring has started.');                    
                    return ping.promise.probe(resource.data.ip);
                })
                .then((response) => {
                    logger.info(`[Runner] The resource <${JSON.stringify(resource)}> response is <${JSON.stringify(response)}>`);
                    const status = resource.status === 'on' ? true : false;
                    if (response.alive !== status) {
                        const newStatus = response.alive === true ? 'on' : 'off';
                        resource.status = newStatus;
                        return resource;
                    }
                    return null;
                })
                .then(resolve)
                .catch(reject);
        });
    },

    serviceMonitoring(resource) {
        return new Promise((resolve, reject) => {
            const chain = Promise.resolve();

            chain
                .then(() => {
                    logger.info('[Runner] The method serviceMonitoring has started.');
                    return this.requestService(resource.data.url);
                })
                .then((status) => {
                    logger.info(`[Runner] The resource <${JSON.stringify(resource)}> response is <${JSON.stringify(status)}>`);
                    if (resource.status !== status) {
                        resource.status = status;
                        return resource;
                    }
                    return null;
                })
                .then(resolve)
                .catch(reject);
        });
    },

    requestService(url) {
        return new Promise((resolve) => {
            axios.get(url)
                .then(() => {
                    resolve('on');
                })
                .catch((error) => {
                    logger.error(`[Runner] An error occurred: ` + error);
                    resolve('off')
                })
        });
    },

    monitoring() {
        /** TODO 
         * 1- Change to use a BO function to search the resource
         * 2- Starting to execute in a loop of 60 seconds
         */
        logger.info('[Runner] The server Monitoring has started.');
        return new Promise((resolve, reject) => {
            const resourceDAO = FatoryDAO.getDAO('resource');
            let allResources = [];
            const filter = {
                isEnabled: true,
            };
            
            resourceDAO.getAll(filter)
                .then((resources) => {
                    logger.info(`[Runner] The resources returned are <${JSON.stringify(resources)}>`);
                    let p = [];
                    for (let i = 0; i < resources.length; i += 1) {
                        let resource = resources[i];
                        allResources.push(resource);
                        if (resource.type == 'server') {
                            p.push(this.serverMonitoring(resource));
                        } else if (resource.type == 'service') {
                            p.push(this.serviceMonitoring(resource));
                        }
                        
                    }
                    return Promise.all(p);
                })
                .then((responses) => { 
                    logger.info(`[Runner] The resources responses returned are <${JSON.stringify(responses)}>`);
                    let p = [];
                    for (let i = 0; i < responses.length; i += 1) {
                        let response = responses[i];
                        if (response) {
                            p.push(resourceDAO.update(response.id, response));
                        } else {
                            let actualResource = allResources[i];
                            logger.info(`[Runner] The resource ${actualResource.name} status is already updated`)
                        }
                    }
                    return Promise.all(p);
                })
                .then(resolve)
                .catch((err) => {
                    logger.error(`[Runner] An error occured while trying to monitor the resources. <${JSON.stringify(err)}>`);
                    reject(err);
                });
        })
    },

    continuousMonitoring(seconds) {
        if(seconds) {
            logger.info(`[Runner] Starting continuous monitoring every ${JSON.stringify(seconds)} seconds`);            
            setInterval(() => {
                this.monitoring();
            }, 1000 * seconds);
        }
    },

};

module.exports = runner;
