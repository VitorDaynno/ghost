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
                    creationDate: nowStub.now(),
                })
                .rejects();

            return resourceDAO.save({
                type: 'database',
                data: {},
                status: 'on',
                creationDate: nowStub.now(),
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
                    creationDate: nowStub.now(),
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                data: {},
                status: 'on',
                creationDate: nowStub.now(),
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
                    creationDate: nowStub.now(),
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                status: 'on',
                creationDate: nowStub.now(),
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
                    creationDate: nowStub.now(),
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                creationDate: nowStub.now(),
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
                    creationDate: nowStub.now(),
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'wrong type',
                data: {},
                status: 'on',
                creationDate: nowStub.now(),
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
                    creationDate: nowStub.now(),
                })
                .rejects();

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'crashed',
                creationDate: nowStub.now(),
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
                    creationDate: nowStub.now(),
                })
                .resolves({
                    _id: '5c05e59193a46d0d7464bdde',
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    creationDate: nowStub.now(),
                });

            return resourceDAO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'on',
                creationDate: nowStub.now(),
            })
                .then((resource) => {
                    expect(resource._id).to.be.equal('5c05e59193a46d0d7464bdde');
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('database');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(nowStub.now());
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getAll', function(){
        it('Should return empty object when email dont exist', function(){
            var findStub = sinon.mock(resourceModel).expects('find')
                .withArgs({email:'email@test.com', password:'123', creationDate: DateHelper.now()})
                .chain('exec')
                .resolves({});

            return resourceDAO.getAll({email:'email@test.com', password:'123', creationDate: DateHelper.now()})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return empty object when password dont exist', function(){
            var findStub = sinon.mock(resourceModel).expects('find')
                .withArgs({email:'test@test.com', password:'1234', creationDate: DateHelper.now()})
                .chain('exec')
                .resolves({});

            return resourceDAO.getAll({email:'test@test.com', password:'1234', creationDate: DateHelper.now()})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a resource when credentials exist', function(){
            var findStub = sinon.mock(resourceModel).expects('find')
                .withArgs({email:'test@test.com', password:'123', creationDate: DateHelper.now()})
                .chain('exec')
                .resolves({name: 'test', email: 'test@test.com'});

            return resourceDAO.getAll({email:'test@test.com', password:'123', creationDate: DateHelper.now()})
                .then(function(resource){
                    expect(resource.name).to.be.equals('test');
                    expect(resource.email).to.be.equals('test@test.com');
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getById', function(){
        it('Should return empty object when id dont exist', function(){
            var findByStub = sinon.mock(resourceModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b7')
                .chain('exec')
                .resolves({});

            return resourceDAO.getById('5bbead798c2a8a92339e88b7')
                .then(function(){
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a resource when id exist', function(){
            var findByStub = sinon.mock(resourceModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b8')
                .chain('exec')
                .resolves({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com', creationDate: date});

            return resourceDAO.getById('5bbead798c2a8a92339e88b8')
                .then(function(resource){
                    expect(resource).to.be.eqls({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com', creationDate: date});
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('update', function(){
        it('Should return error because id is empty', function(){
            var updateStub = sinon.mock(resourceModel).expects('findByIdAndUpdate')
                .withArgs({})
                .rejects();

            return resourceDAO.update('', {})
                .then()
                .catch(function(){
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should return error because body is empty', function(){
            var updateStub = sinon.mock(resourceModel).expects('findByIdAndUpdate')
                .withArgs({})
                .rejects();

            return resourceDAO.update('5c088673fb2f579adcca9ed1', {})
                .then()
                .catch(function(){
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should return a resource when updated', function(){
            var updateStub = sinon.mock(resourceModel).expects('findByIdAndUpdate')
                .withArgs('5c088673fb2f579adcca9ed1', {$set: {name: 'changedName', modificationDate: DateHelper.now()}}, {new: true})
                .resolves({_id: '5c088673fb2f579adcca9ed1', name: 'changedName', email: 'test@mailtest.com', creationDate: DateHelper.now(), modificationDate: DateHelper.now()});

            return resourceDAO.update('5c088673fb2f579adcca9ed1', {name: 'changedName', modificationDate: DateHelper.now()})
                .then(function(){
                    expect(updateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('delete', function(){
        it('Should return error because id is empty', function(){
            var updateStub = sinon.mock(resourceModel).expects('update')
                .withArgs({})
                .rejects();

            return resourceDAO.delete()
                .then()
                .catch(function(){
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should delete a resource when id is correct', function(){
            var updateStub = sinon.mock(resourceModel).expects('update')
                .withArgs({_id: '5c088673fb2f579adcca9ed1'}, {isEnabled: false, exclusionDate: DateHelper.now()})
                .resolves({_id: '5c088673fb2f579adcca9ed1', name: 'test', email: 'test@mailtest.com', isEnabled: false, creationDate: DateHelper.now(), exclusionDate: DateHelper.now()});

            return resourceDAO.delete('5c088673fb2f579adcca9ed1', {isEnabled: false, exclusionDate: DateHelper.now()})
                .then(function(){
                    expect(updateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
