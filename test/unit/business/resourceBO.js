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
    let getByIdStub;
    let updateStub;
    let parseResourceStub;

    beforeEach(() => {
        getAllStub = sinon.stub(resourceDAO, 'getAll');
        saveStub = sinon.stub(resourceDAO, 'save');
        getByIdStub = sinon.stub(resourceDAO, 'getById');
        updateStub = sinon.stub(resourceDAO, 'update');
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
        getByIdStub.restore();
        updateStub.restore();
    });

    describe('save', () => {
        it('Should return error when body does not exist', () => resourceBO.save()
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('name are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                }));
        it('Should return error when body is empty', () => resourceBO.save({})
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('name are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                }));
        it('Should return error when body not contains name', () => resourceBO.save({
                type: 'database',
                data: {},
                status: 'on',
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('name are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                }));
        it('Should return error when body not contains type', () => resourceBO.save({
                name: 'resource-test',
                data: {},
                status: 'on',
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('type are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                }));
        it('Should return error when body not contains data', () => resourceBO.save({
                name: 'resource-test',
                type: 'database',
                status: 'on',
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('data are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                }));
        it('Should return error when body not contains status', () => resourceBO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('status are required');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                }));
        it('Should return error when type is invalid', () => resourceBO.save({
                name: 'resource-test',
                type: 'wrong type',
                data: {},
                status: 'on',
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('type is invalid');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                }));
        it('Should return error when status is invalid', () => resourceBO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'moved',
            })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('status is invalid');
                    expect(getAllStub.callCount).to.be.equals(0);
                    expect(saveStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                }));
        it('Should return a resource when entity are correct with type database', () => {
            saveStub
                .withArgs({
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                    creationDate: date,
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'database',
                data: {},
                status: 'on',
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('database');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(date);
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
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'service',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'service',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'service',
                    data: {},
                    status: 'on',
                    creationDate: date,
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'service',
                data: {},
                status: 'on',
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('service');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(date);
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
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    creationDate: date,
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'on',
                creationDate: date,
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(date);
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
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'on',
                    creationDate: date,
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'on',
                creationDate: date,
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('on');
                    expect(resource.creationDate).to.be.equal(date);
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
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    creationDate: date,
                });

            return resourceBO.save({
                name: 'resource-test',
                type: 'server',
                data: {},
                status: 'off',
                creationDate: date,
            })
                .then((resource) => {
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('off');
                    expect(resource.creationDate).to.be.equal(date);
                    expect(saveStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(1);
                    expect(nowStub.callCount).to.be.equals(1);
                });
        });
    });

    describe('getById', () => {
        it('should return error when body does not exist', () => {
            return resourceBO.getById()
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('Id are required');
                    expect(getByIdStub.callCount).to.be.equals(0);
                    expect(getByIdStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('should return error when body does not contains the field id', () => {
            return resourceBO.getById({})
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('Id are required');
                    expect(getByIdStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
        it('should return error when id does not exist', () => {
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b7')
                .returns({});

            return resourceBO.getById({ id: '5bbead798c2a8a92339e88b7' })
                .then((resource) => {
                    expect(resource).to.be.eqls({});
                    expect(getByIdStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                    getByIdStub.restore();
                });
        });
        it('should return a resource when resourceId belongs to some resource', () => {
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b8')
                .returns({
                    _id: '5bbead798c2a8a92339e88b8',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                });

            parseResourceStub
                .withArgs({
                    _id: '5bbead798c2a8a92339e88b8',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                })
                .returns({
                    id: '5bbead798c2a8a92339e88b8',
                    name: 'resource-test',
                    type: 'server',
                    data: {},
                    status: 'off',
                    creationDate: date,
                });

            return resourceBO.getById({ id: '5bbead798c2a8a92339e88b8' })
                .then((resource) => {
                    expect(resource.id).to.be.equal('5bbead798c2a8a92339e88b8');
                    expect(resource.name).to.be.equal('resource-test');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eql({});
                    expect(resource.status).to.be.equal('off');
                    expect(resource.creationDate).to.be.equal(date);
                    expect(getByIdStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(1);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });
    });

    describe('update', () => {
        it('Should return error when body does not exist', () => {
            return resourceBO.update()
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('Id are required');
                    expect(updateStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });

        it('Should return error when body does contains id', () => {
            return resourceBO.update({ name: 'tests' })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('Id are required');
                    expect(updateStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });

        it('Should return error when try update status of resource to invalid status', () => {
            return resourceBO.update({ id: '5c088673fb2f579adcca9ed1', status: 'wrong' })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('status is invalid');
                    expect(updateStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });

        it('Should return error when try update type of resource to invalid type', () => {
            return resourceBO.update({ id: '5c088673fb2f579adcca9ed1', type: 'wrong' })
                .then()
                .catch((error) => {
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('type is invalid');
                    expect(updateStub.callCount).to.be.equals(0);
                    expect(parseResourceStub.callCount).to.be.equals(0);
                    expect(nowStub.callCount).to.be.equals(0);
                });
        });


        it('Should return a resource when updated with success', () => {
            updateStub
                .withArgs('5c088673fb2f579adcca9ed1', { name: 'changeName', modificationDate: date })
                .returns({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'changeName',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                    modificationDate: date,
                });

            parseResourceStub
                .withArgs({
                    _id: '5c088673fb2f579adcca9ed1',
                    name: 'changeName',
                    type: 'server',
                    data: {},
                    status: 'off',
                    isEnabled: true,
                    creationDate: date,
                    modificationDate: date,
                })
                .returns({
                    id: '5c088673fb2f579adcca9ed1',
                    name: 'changeName',
                    type: 'server',
                    data: {},
                    status: 'off',
                    creationDate: date,
                    modificationDate: date,
                });

            return resourceBO.update({ id: '5c088673fb2f579adcca9ed1', name: 'changeName' })
                .then((resource) => {
                    expect(resource.id).to.be.equal('5c088673fb2f579adcca9ed1');
                    expect(resource.name).to.be.equal('changeName');
                    expect(resource.type).to.be.equal('server');
                    expect(resource.data).to.be.eqls({});
                    expect(resource.status).to.be.equal('off');
                    expect(resource.creationDate).to.be.equal(date);
                    expect(resource.modificationDate).to.be.equal(date);
                    expect(updateStub.callCount).to.be.equals(1);
                    expect(parseResourceStub.callCount).to.be.equals(1);
                    expect(nowStub.callCount).to.be.equals(1);
                });
        });
    });

    describe('delete', () => {
        it('Should return error when body does not exist', () => {
            return resourceBO.delete()
                .then()
                .catch((error) => {
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
