const chai = require('chai');
const sinon = require('sinon');
const mocha = require('mocha');
require('sinon-mongoose');

const { expect } = chai;
const {
    describe,
    it,
    beforeEach,
    afterEach,
} = mocha;

const ResourceDAO = require('../../../src/daos/resourceDAO');
const resourceModel = require('../../../src/models/resource')();
const DateHelper = require('../../../src/helpers/dateHelper');


describe('resourceDAO', () => {
    const resourceDAO = new ResourceDAO({
        resource: resourceModel,
    });

    let date;
    let nowStub;

    beforeEach(() => {
        nowStub = sinon.stub(DateHelper, 'now');
        date = new Date();
        nowStub
            .returns(date);
    });

    afterEach(() => {
        nowStub.restore();
    });

    describe('save', () => {
        it('Should return error because object is empty', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({})
                .rejects();

            return resourceDAO.save({})
                .then()
                .catch(() => {
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object not contains name', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({
                    type: 'database',
                    data: {},
                    status: 'on',
                    creationDate: nowStub,
                })
                .rejects();

            return resourceDAO.save({
                type: 'database',
                data: {},
                status: 'on',
                creationDate: nowStub,
            })
                .then()
                .catch(() => {
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object not contains type', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({
                    name: 'resource-test',
                    data: {},
                    status: 'on',
                    creationDate: nowStub,
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                data: {},
                status: 'on',
                creationDate: nowStub,
            })
                .then()
                .catch(() => {
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object not contains data', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({
                    name: 'resource-test',
                    type: 'database',
                    status: 'on',
                    creationDate: nowStub,
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                status: 'on',
                creationDate: nowStub,
            })
                .then()
                .catch(() => {
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object not contains status', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    creationDate: nowStub,
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                creationDate: nowStub,
            })
                .then()
                .catch(() => {
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object not contains creationDate', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'on',
            })
                .then()
                .catch(() => {
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object contains incorrect type', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({
                    name: 'resource-test',
                    type: 'wrong type',
                    data: {},
                    status: 'on',
                    creationDate: nowStub,
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'wrong type',
                data: {},
                status: 'on',
                creationDate: nowStub,
            })
                .then()
                .catch(() => {
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object contains incorrect status', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'crashed',
                    creationDate: nowStub,
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'crashed',
                creationDate: nowStub,
            })
                .then()
                .catch(() => {
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a resource with success', () => {
            const createStub = sinon.mock(resourceModel).expects('create')
                .withArgs({
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    creationDate: nowStub,
                })
                .resolves({
                    _id: '5c05e59193a46d0d7464bdde',
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    creationDate: nowStub,
                });

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'on',
                creationDate: nowStub,
            })
                .then((resource) => {
                    expect(resource._id).to.be.equal('5c05e59193a46d0d7464bdde');
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('database');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(nowStub);
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getAll', () => {
        it('Should return empty object when name dont exist', () => {
            const findStub = sinon.mock(resourceModel).expects('find')
                .withArgs({ name: 'resource' })
                .chain('exec')
                .resolves({});

            return resourceDAO.getAll({ name: 'resource' })
                .then(() => {
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a resource when credentials exist', () => {
            const findStub = sinon.mock(resourceModel).expects('find')
                .withArgs({ name: 'resource-test' })
                .chain('exec')
                .resolves({
                    _id: '5bbead798c2a8a92339e88b8',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                });

            return resourceDAO.getAll({ name: 'resource-test' })
                .then((resource) => {
                    expect(resource._id).to.be.equal('5bbead798c2a8a92339e88b8');
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('off');
                    expect(resource.isEnabled).to.be.equal(true);
                    expect(resource.creationDate).to.be.equal(date);
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getById', () => {
        it('Should return empty object when id dont exist', () => {
            const findByStub = sinon.mock(resourceModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b7')
                .chain('exec')
                .resolves({});

            return resourceDAO.getById('5bbead798c2a8a92339e88b7')
                .then(() => {
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a resource when id exist', () => {
            const findByStub = sinon.mock(resourceModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b8')
                .chain('exec')
                .resolves({
                    _id: '5bbead798c2a8a92339e88b8',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                });

            return resourceDAO.getById('5bbead798c2a8a92339e88b8')
                .then((resource) => {
                    expect(resource._id).to.be.equal('5bbead798c2a8a92339e88b8');
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('off');
                    expect(resource.isEnabled).to.be.equal(true);
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('update', () => {
        it('Should return error because id is empty', () => {
            const updateStub = sinon.mock(resourceModel).expects('findByIdAndUpdate')
                .withArgs({})
                .rejects();

            return resourceDAO.update('', {})
                .then()
                .catch(() => {
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should return error because body is empty', () => {
            const updateStub = sinon.mock(resourceModel).expects('findByIdAndUpdate')
                .withArgs({})
                .rejects();

            return resourceDAO.update('5c088673fb2f579adcca9ed1', {})
                .then()
                .catch(() => {
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should return a resource when updated', () => {
            const updateStub = sinon.mock(resourceModel).expects('findByIdAndUpdate')
                .withArgs('5c088673fb2f579adcca9ed1', { $set: { name: 'test', modificationDate: DateHelper.now() } }, { new: true })
                .resolves({
                    _id: '5bbead798c2a8a92339e88b8',
                    name: 'test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                    modificationDate: DateHelper.now(),
                });

            return resourceDAO.update('5c088673fb2f579adcca9ed1', { name: 'test', modificationDate: DateHelper.now() })
                .then(() => {
                    expect(updateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('delete', () => {
        it('Should return error because id is empty', () => {
            const updateStub = sinon.mock(resourceModel).expects('update')
                .withArgs({})
                .rejects();

            return resourceDAO.delete()
                .then()
                .catch(() => {
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should delete a resource when id is correct', () => {
            const updateStub = sinon.mock(resourceModel).expects('update')
                .withArgs({ _id: '5c088673fb2f579adcca9ed1' }, { isEnabled: false, exclusionDate: DateHelper.now() })
                .resolves({
                    _id: '5bbead798c2a8a92339e88b8',
                    name: 'test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                    modificationDate: DateHelper.now(),
                    exclusionDate: DateHelper.now()
                });

            return resourceDAO.delete('5c088673fb2f579adcca9ed1', { isEnabled: false, exclusionDate: DateHelper.now() })
                .then(() => {
                    expect(updateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
