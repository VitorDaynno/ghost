const chai = require('chai');
const sinon = require('sinon');
const mocha = require('mocha');
const ResourceDAO = require('../../../src/daos/resourceDAO');
const resourceModel = require('../../../src/models/resource')();
const runner = require('../../../src/runner');

require('sinon-mongoose');

const { expect } = chai;
const {
    describe,
    it,
    beforeEach,
    afterEach,
} = mocha;

describe('Runner', () => {
    const resourceDAO = new ResourceDAO({
        resource: resourceModel,
    });
    let getAllStub;
    let serverMonitoringStub;
    let requestStub;

    beforeEach(() => {
        getAllStub = sinon.stub(resourceDAO, 'getAll');
        serverMonitoringStub = sinon.stub(runner, 'serverMonitoring');
    });

    afterEach(() => {
        getAllStub.restore();
        serverMonitoringStub.restore();
    });

    describe('monitoring', () => {
        it('Should return status on and update the resource', () => {
        });
        it('Should return status off and update the resource', () => {});
        it('Should return status off and do not update the resource', () => {});
        it('Should return status on and do not update the resource', () => {});
        it('Should do nothing when there is not a resource', () => {});
    });

    describe('serverMonitoring', () => {
        it('Should return error because while pinging a invalid server', () => {});
        it('Should return status on ', () => {});
        it('Should return status off', () => {});
        it('Should return diferent status from the resource to be updated - on', () => {});
        it('Should return diferent status from the resource to be updated - off', () => {});
        it('Should do nothing when there is a empty resource', () => {});
    });

    describe('serviceMonitoring', () => {
        it('Should return status on', () => {
            const resource = {
                _id: '5bbead798c2a8a92339e88b8',
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'off',
                isEnabled: true,
                creationDate: Date(),
            };
            return runner.serviceMonitoring(resource)
                .then((response) => {
                    expect(response.status).to.be.equal('on');
                    expect(requestStub.callCount).to.be.equal(1);
                });
        });
        it('Should return status off', () => {
            const resource = {
                _id: '5bbead798c2a8a92339e88b8',
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'off',
                isEnabled: true,
                creationDate: Date(),
            };
            return runner.serviceMonitoring(resource)
                .then((response) => {
                    expect(response.status).to.be.equal('off');
                    expect(requestStub.callCount).to.be.equal(1);
                });
        });
        it('Should return diferent status from the resource to be updated - on', () => {
            const resource = {
                _id: '5bbead798c2a8a92339e88b8',
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'off',
                isEnabled: true,
                creationDate: Date(),
            };
            return runner.serviceMonitoring(resource)
                .then((response) => {
                    expect(response.status).to.be.equal('on');
                    expect(requestStub.callCount).to.be.equal(1);
                });
        });
        it('Should return diferent status from the resource to be updated - off', () => {
            const resource = {
                _id: '5bbead798c2a8a92339e88b8',
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'off',
                isEnabled: true,
                creationDate: Date(),
            };
            return runner.serviceMonitoring(resource)
                .then((response) => {
                    expect(response.status).to.be.equal('off');
                    expect(requestStub.callCount).to.be.equal(1);
                });
        });
    });
});
