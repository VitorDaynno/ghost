var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var ResourceBO = require('../../../src/business/resourceBO.js');
var DAOFactory = require('../../../src/factories/factoryDAO');
var JWTHelper = require('../../../src/helpers/jwtHelper');
var ModelHelper = require('../../../src/helpers/modelHelper');
var CryptoHelper = require('../../../src/helpers/cryptoHelper');
var DateHelper = require('../../../src/helpers/dateHelper');

describe('resourceBO', function(){
    var resourceDAO = DAOFactory.getDAO('resource');
    var jwtHelper = new JWTHelper();

    var resourceBO = new ResourceBO({
        resourceDAO: resourceDAO,
        jwtHelper: jwtHelper,
        modelHelper: ModelHelper,
        cryptoHelper: CryptoHelper,
        dateHelper: DateHelper
    });

    var nowStub;
    var date;

    beforeEach(function() {
        nowStub = sinon.stub(DateHelper, 'now');
        date = new Date();
        nowStub
            .returns(date);
    });

    afterEach(function() {
        nowStub.restore();
    });    

    describe('save', function(){
        it('Should return error when body does not exist', function(){
            var getAllStub = sinon.stub(resourceDAO, 'getAll');
            var saveStub = sinon.stub(resourceDAO, 'save');
            var encodeTokenStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.save()
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Email are required');
                        expect(getAllStub.callCount).to.be.equals(0);
                        expect(saveStub.callCount).to.be.equals(0);
                        expect(encodeTokenStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getAllStub.restore();
                        saveStub.restore();
                        encodeTokenStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('Should return error when body is empty', function(){
            var getAllStub = sinon.stub(resourceDAO, 'getAll');
            var saveStub = sinon.stub(resourceDAO, 'save');
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.save({})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Email are required');
                        expect(getAllStub.callCount).to.be.equals(0);
                        expect(saveStub.callCount).to.be.equals(0);
                        expect(encryptStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getAllStub.restore();
                        saveStub.restore();
                        encryptStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('Should return error when body not contains email', function(){
            var getAllStub = sinon.stub(resourceDAO, 'getAll');
            var saveStub = sinon.stub(resourceDAO, 'save');
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.save({name: 'test', 'password': '123'})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Email are required');
                        expect(getAllStub.callCount).to.be.equals(0);
                        expect(saveStub.callCount).to.be.equals(0);
                        expect(encryptStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getAllStub.restore();
                        saveStub.restore();
                        encryptStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('Should return error when body not contains name', function(){
            var getAllStub = sinon.stub(resourceDAO, 'getAll');
            var saveStub = sinon.stub(resourceDAO, 'save');
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.save({email: 'test@mailtest.com', password: '123'})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Name are required');
                        expect(getAllStub.callCount).to.be.equals(0);
                        expect(saveStub.callCount).to.be.equals(0);
                        expect(encryptStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getAllStub.restore();
                        saveStub.restore();
                        encryptStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('Should return error when body not contains password', function(){
            var getAllStub = sinon.stub(resourceDAO, 'getAll');
            var saveStub = sinon.stub(resourceDAO, 'save');
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.save({email: 'test@mailtest.com', name: 'test'})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Password are required');
                        expect(getAllStub.callCount).to.be.equals(0);
                        expect(saveStub.callCount).to.be.equals(0);
                        expect(encryptStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getAllStub.restore();
                        saveStub.restore();
                        encryptStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('Should return a resource when entity are correct', function(){
            var getAllStub = sinon.stub(resourceDAO, 'getAll');
            getAllStub
                .withArgs({email:'tests@mailtest.com'})
                .returns(Promise.resolve({}));

            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            encryptStub
                .withArgs('123')
                .returns('efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19');

            var saveStub = sinon.stub(resourceDAO, 'save');
            saveStub
                .withArgs({email: 'test@mailtest.com', name: 'test', password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true, creationDate: date})
                .returns({_id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test',
                            password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true, creationDate: date});

            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test',
                            password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true, creationDate: date})
                .returns({id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test'});

            return resourceBO.save({email: 'test@mailtest.com', name: 'test', password: '123'})
                    .then(function(resource) {
                        expect(resource).to.be.eqls({id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test'});
                        expect(getAllStub.callCount).to.be.equals(1);
                        expect(saveStub.callCount).to.be.equals(1);
                        expect(encryptStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(1);
                        expect(nowStub.callCount).to.be.equals(1);
                        getAllStub.restore();
                        saveStub.restore();
                        encryptStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('Should return a error when entity already exist', function(){
            var getAllStub = sinon.stub(resourceDAO, 'getAll');
            getAllStub
                .withArgs({email:'test@mailtest.com', isEnabled: true})
                .returns([{_id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test',
                            password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true, creationDate: date}]);

            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');

            var saveStub = sinon.stub(resourceDAO, 'save');

            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return resourceBO.save({email: 'test@mailtest.com', name: 'test', password: '123'})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.eqls(409);
                        expect(error.message).to.be.equals('Entered email is already being used');
                        expect(getAllStub.callCount).to.be.equals(1);
                        expect(saveStub.callCount).to.be.equals(0);
                        expect(encryptStub.callCount).to.be.equals(0);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getAllStub.restore();
                        saveStub.restore();
                        encryptStub.restore();
                        parseUserStub.restore();
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
