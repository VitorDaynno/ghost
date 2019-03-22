const chai = require('chai');
const sinon = require('sinon');
const mocha = require('mocha');

const ResourceBO = require('../../../src/business/resourceBO.js');
const DAOFactory = require('../../../src/factories/factoryDAO');
const ModelHelper = require('../../../src/helpers/modelHelper');
const DateHelper = require('../../../src/helpers/dateHelper');

const { expect } = chai;
const {
    describe,
    it,
    beforeEach,
    afterEach,
} = mocha;

describe('resourceBO', () => {
    const resourceDAO = DAOFactory.getDAO('resource');

    const resourceBO = new ResourceBO({
        resourceDAO,
        modelHelper: ModelHelper,
        dateHelper: DateHelper,
    });

    let nowStub;
    let date;
    let getAllStub;
    let saveStub;
    let parseResourceStub;

    beforeEach(() => {
        getAllStub = sinon.stub(resourceDAO, 'getAll');
        saveStub = sinon.stub(resourceDAO, 'save');
        parseResourceStub = sinon.stub(ModelHelper, 'parseResource');

        nowStub = sinon.stub(DateHelper, 'now');
        date = new Date();
        nowStub
            .returns(date);
    });

    afterEach(() => {
        getAllStub.restore();
        saveStub.restore();
        parseResourceStub.restore();
        nowStub.restore();
    });

    describe('save', () => {
        it('Should return error when body does not exist', () => {
            return resourceBO.save()
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('name are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('Should return error when body is empty', () => {
            return resourceBO.save({})
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('name are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('Should return error when body not contains name', () => {
            return resourceBO.save({
                type: 'database',
                data: {},
                status: 'on',
                creationDate: DateHelper.now(),
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('name are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('Should return error when body not contains type', () => {
            return resourceBO.save({
                name: 'resource-test',
                data: {},
                status: 'on',
                creationDate: DateHelper.now(),
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('type are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('Should return error when body not contains data', () => {
            return resourceBO.save({
                name: 'resource-test',
                type: 'database',
                status: 'on',
                creationDate: DateHelper.now(),
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('data are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('Should return error when body not contains status', () => {
            return resourceBO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                creationDate: DateHelper.now(),
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('status are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('Should return error when type is invalid', () => {
            return resourceBO.save({
                name: 'resource-test',
                type: 'wrong type',
                data: {},
                status: 'on',
                creationDate: DateHelper.now(),
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('type is invalid');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('Should return error when status is invalid', () => {
            return resourceBO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'moved',
                creationDate: DateHelper.now(),
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('status is invalid');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('Should return a resource when entity are correct with type database', () => {
            saveStub
                .withArgs({
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'on',
                creationDate: DateHelper.now(),
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('database');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(DateHelper.now());
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(1);
                    expect(nowStub.callCount).to.be.equals(1);
                });
        });
        it('Should return a resource when entity are correct with type service', () => {
            saveStub
                .withArgs({
                    name: 'resource-test',
                    type: 'service',
                    data: {},
                    status: 'on',
                    creationDate: DateHelper.now(),
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'service',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'service',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'service',
                    data: {},
                    status: 'on',
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'service',
                data: {},
                status: 'on',
                creationDate: DateHelper.now(),
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('service');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(DateHelper.now());
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(1);
                    expect(nowStub.callCount).to.be.equals(1);
                });
        });
        it('Should return a resource when entity are correct with type server', () => {
            saveStub
                .withArgs({
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    creationDate: DateHelper.now(),
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'on',
                creationDate: DateHelper.now(),
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(DateHelper.now());
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(1);
                    expect(nowStub.callCount).to.be.equals(1);
                });
        });
        it('Should return a resource when entity are correct with status on', () => {
            saveStub
                .withArgs({
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    creationDate: DateHelper.now(),
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'on',
                creationDate: DateHelper.now(),
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(DateHelper.now());
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(1);
                    expect(nowStub.callCount).to.be.equals(1);
                });
        });
        it('Should return a resource when entity are correct with status off', () => {
            saveStub
                .withArgs({
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    creationDate: DateHelper.now(),
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: DateHelper.now(),
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'off',
                creationDate: DateHelper.now(),
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('off');
                    expect(resource.creationDate).to.be.equal(DateHelper.now());
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(1);
                    expect(nowStub.callCount).to.be.equals(1);
                });
        });
    });

    describe('getById', function(){
        it('should return error when body does not exist', function() {
            var getByIdStub = sinon.stub(resourceDAO, 'getById');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.getById()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('should return error when body does not contains the field id', function() {
            var getByIdStub = sinon.stub(resourceDAO, 'getById');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.getById({})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(getByIdStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('should return error when id does not exist', function() {
            var getByIdStub = sinon.stub(resourceDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b7')
                .returns({});
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.getById({id: '5bbead798c2a8a92339e88b7'})
                    .then(function(resource){
                        expect(resource).to.be.eqls({});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('should return a resource when resourceId belongs to some resource', function() {
            var getByIdStub = sinon.stub(resourceDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b8')
                .returns({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com', isEnabled: true, creationDate: date});
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com', isEnabled: true, creationDate: date})
                .returns({id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});

            return resourceBO.getById({id: '5bbead798c2a8a92339e88b8'})
                    .then(function(resource){
                        expect(resource).to.be.eqls({id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(1);
                        expect(nowStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
    });

    describe('update', function(){
        it('Should return error when body does not exist', function(){
            var updateStub = sinon.stub(resourceDAO, 'update');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.update()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(updateStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        updateStub.restore();
                        parseUserStub.restore();
                    });
        });

        it('Should return error when body does contains id', function(){
            var updateStub = sinon.stub(resourceDAO, 'update');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.update({name: 'tests'})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(updateStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        updateStub.restore();
                        parseUserStub.restore();
                    });
        });

        it('Should return a resource when updated with success', function(){
            var updateStub = sinon.stub(resourceDAO, 'update');
            updateStub
                .withArgs('5c088673fb2f579adcca9ed1', {name: 'changeName', modificationDate: date})
                .returns({_id: '5c088673fb2f579adcca9ed1', name: 'changeName', email: 'test@testemail.com', creationDate: date, modificationDate: date});

            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: '5c088673fb2f579adcca9ed1', name: 'changeName', email: 'test@testemail.com', creationDate: date, modificationDate: date})
                .returns({id: '5c088673fb2f579adcca9ed1', name: 'changeName', email: 'test@testemail.com'});

            return resourceBO.update({id: '5c088673fb2f579adcca9ed1', name: 'changeName'})
                    .then(function(resource) {
                        expect(resource).to.be.eqls({id: '5c088673fb2f579adcca9ed1', name: 'changeName', email: 'test@testemail.com'});
                        expect(updateStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(1);
                        expect(nowStub.callCount).to.be.equals(1);
                        updateStub.restore();
                        parseUserStub.restore();
                    });
        });
    });

    describe('delete', function(){
        it('Should return error when body does not exist', function(){
            var deleteStub = sinon.stub(resourceDAO, 'delete');

            return resourceBO.delete()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(deleteStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        deleteStub.restore();
                    });
        });

        it('Should return error when body does contains id', function(){
            var deleteStub = sinon.stub(resourceDAO, 'delete');

            return resourceBO.delete({})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(deleteStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        deleteStub.restore();
                    });
        });

        it('Should delete a resource', function(){
            var deleteStub = sinon.stub(resourceDAO, 'delete');
            deleteStub
                .withArgs({id: '5c088673fb2f579adcca9ed1'},{isEnabled: false, exclusionDate: date})
                .returns({});

            return resourceBO.delete({id: '5c088673fb2f579adcca9ed1'})
                    .then(function() {
                        expect(deleteStub.callCount).to.be.equals(1);
                        expect(nowStub.callCount).to.be.equals(1);
                        deleteStub.restore();
                    });
        });
    });
});
