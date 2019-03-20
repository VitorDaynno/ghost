var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var UserBO = require('../../../src/business/userBO.js');
var DAOFactory = require('../../../src/factories/factoryDAO');
var JWTHelper = require('../../../src/helpers/jwtHelper');
var ModelHelper = require('../../../src/helpers/modelHelper');
var CryptoHelper = require('../../../src/helpers/cryptoHelper');
var DateHelper = require('../../../src/helpers/dateHelper');

describe('userBO', function(){
    var userDAO = DAOFactory.getDAO('user');
    var jwtHelper = new JWTHelper();

    var userBO = new UserBO({
        userDAO: userDAO,
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

    describe('auth', function(){
        it('Should return error when email dont exist', function(){
            return userBO.auth({password:'123'})
                .then()
                .catch(function (error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('Email and password are required');
                });
        });
        it('Should return error when password dont exist', function(){
            return userBO.auth({email:'test@mailtest.com'})
                .then()
                .catch(function (error){
                    expect(error.code).to.be.equals(422);
                    expect(error.message).to.be.equals('Email and password are required');
                });
        });
        it('Should return error when user dont exist', function(){
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            encryptStub
                .withArgs('1234')
                .returns('59701bbf983a8f461f9cd48e8a4ddbeeca80c7e6766eb907c9850205aa55a9cb');

            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'tests@mailtest.com', password: '59701bbf983a8f461f9cd48e8a4ddbeeca80c7e6766eb907c9850205aa55a9cb', isEnabled: true})
                .returns(Promise.resolve({}));

            return userBO.auth({email:'tests@mailtest.com', password: '1234'})
                .then()
                .catch(function (error){
                    expect(getAllStub.callCount).to.be.equals(1);
                    expect(encryptStub.callCount).to.be.equals(1);
                    expect(error.code).to.be.equals(401);
                    expect(error.message).to.be.equals('Email or password are incorrect');
                    getAllStub.restore();
                    encryptStub.restore();
                });
        });
        it('Should return error when password is incorrect', function(){
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            encryptStub
                .withArgs('123')
                .returns('efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19');

            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'test@mailtest.com', password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true})
                .returns(Promise.resolve({}));

            return userBO.auth({email: 'test@mailtest.com', password: '123'})
                .then()
                .catch(function (error){
                    expect(getAllStub.callCount).to.be.equals(1);
                    expect(encryptStub.callCount).to.be.equals(1);
                    expect(error.code).to.be.equals(401);
                    expect(error.message).to.be.equals('Email or password are incorrect');
                    getAllStub.restore();
                    encryptStub.restore();
                });
        });
        it('Should return success with correct user', function(){
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            encryptStub
                .withArgs('1234')
                .returns('59701bbf983a8f461f9cd48e8a4ddbeeca80c7e6766eb907c9850205aa55a9cb');

            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'test@mailtest.com', password: '59701bbf983a8f461f9cd48e8a4ddbeeca80c7e6766eb907c9850205aa55a9cb', isEnabled: true})
                .returns([{_id: 1, name: 'test', email: 'test@mailtest.com'}]);

            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: 1, name: 'test', email: 'test@mailtest.com'})
                .returns({id: 1, name: 'test', email: 'test@mailtest.com'});

            var createTokenStub = sinon.stub(jwtHelper, 'createToken');
            createTokenStub
                .withArgs({id: 1, name: 'test', email: 'test@mailtest.com'})
                .returns('token-jwt');

            return userBO.auth({email:'test@mailtest.com', password: '1234'})
                    .then(function(auth){
                        expect(encryptStub.callCount).to.be.equals(1);
                        expect(getAllStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(1);
                        expect(createTokenStub.callCount).to.be.equals(1);
                        expect(auth.name).to.be.equals('test');
                        expect(auth.email).to.be.equals('test@mailtest.com');
                        expect(auth.token).to.be.equals('token-jwt');
                        encryptStub.restore();
                        getAllStub.restore();
                        parseUserStub.restore();
                        createTokenStub.restore();
                    });
        });
    });

    describe('save', function(){
        it('Should return error when body does not exist', function(){
            var getAllStub = sinon.stub(userDAO, 'getAll');
            var saveStub = sinon.stub(userDAO, 'save');
            var encodeTokenStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.save()
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
            var getAllStub = sinon.stub(userDAO, 'getAll');
            var saveStub = sinon.stub(userDAO, 'save');
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.save({})
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
            var getAllStub = sinon.stub(userDAO, 'getAll');
            var saveStub = sinon.stub(userDAO, 'save');
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.save({name: 'test', 'password': '123'})
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
            var getAllStub = sinon.stub(userDAO, 'getAll');
            var saveStub = sinon.stub(userDAO, 'save');
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.save({email: 'test@mailtest.com', password: '123'})
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
            var getAllStub = sinon.stub(userDAO, 'getAll');
            var saveStub = sinon.stub(userDAO, 'save');
            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.save({email: 'test@mailtest.com', name: 'test'})
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
        it('Should return a user when entity are correct', function(){
            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'tests@mailtest.com'})
                .returns(Promise.resolve({}));

            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');
            encryptStub
                .withArgs('123')
                .returns('efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19');

            var saveStub = sinon.stub(userDAO, 'save');
            saveStub
                .withArgs({email: 'test@mailtest.com', name: 'test', password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true, creationDate: date})
                .returns({_id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test',
                            password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true, creationDate: date});

            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test',
                            password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true, creationDate: date})
                .returns({id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test'});

            return userBO.save({email: 'test@mailtest.com', name: 'test', password: '123'})
                    .then(function(user) {
                        expect(user).to.be.eqls({id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test'});
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
            var getAllStub = sinon.stub(userDAO, 'getAll');
            getAllStub
                .withArgs({email:'test@mailtest.com', isEnabled: true})
                .returns([{_id: '5c088673fb2f579adcca9ed1', email: 'test@mailtest.com', name: 'test',
                            password: 'efb0dd98ad3df96b06ce7fc361b2938826e9ccbac0cf31dba3c690b447254d19', isEnabled: true, creationDate: date}]);

            var encryptStub = sinon.stub(CryptoHelper, 'encrypt');

            var saveStub = sinon.stub(userDAO, 'save');

            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.save({email: 'test@mailtest.com', name: 'test', password: '123'})
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
            var getByIdStub = sinon.stub(userDAO, 'getById');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.getById()
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
            var getByIdStub = sinon.stub(userDAO, 'getById');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.getById({})
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
            var getByIdStub = sinon.stub(userDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b7')
                .returns({});
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.getById({id: '5bbead798c2a8a92339e88b7'})
                    .then(function(user){
                        expect(user).to.be.eqls({});
                        expect(getByIdStub.callCount).to.be.equals(1);
                        expect(parseUserStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        getByIdStub.restore();
                        parseUserStub.restore();
                    });
        });
        it('should return a user when userId belongs to some user', function() {
            var getByIdStub = sinon.stub(userDAO, 'getById');
            getByIdStub
                .withArgs('5bbead798c2a8a92339e88b8')
                .returns({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com', isEnabled: true, creationDate: date});
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com', isEnabled: true, creationDate: date})
                .returns({id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});

            return userBO.getById({id: '5bbead798c2a8a92339e88b8'})
                    .then(function(user){
                        expect(user).to.be.eqls({id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com'});
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
            var updateStub = sinon.stub(userDAO, 'update');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.update()
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
            var updateStub = sinon.stub(userDAO, 'update');
            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');

            return userBO.update({name: 'tests'})
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

        it('Should return a user when updated with success', function(){
            var updateStub = sinon.stub(userDAO, 'update');
            updateStub
                .withArgs('5c088673fb2f579adcca9ed1', {name: 'changeName', modificationDate: date})
                .returns({_id: '5c088673fb2f579adcca9ed1', name: 'changeName', email: 'test@testemail.com', creationDate: date, modificationDate: date});

            var parseUserStub = sinon.stub(ModelHelper, 'parseUser');
            parseUserStub
                .withArgs({_id: '5c088673fb2f579adcca9ed1', name: 'changeName', email: 'test@testemail.com', creationDate: date, modificationDate: date})
                .returns({id: '5c088673fb2f579adcca9ed1', name: 'changeName', email: 'test@testemail.com'});

            return userBO.update({id: '5c088673fb2f579adcca9ed1', name: 'changeName'})
                    .then(function(user) {
                        expect(user).to.be.eqls({id: '5c088673fb2f579adcca9ed1', name: 'changeName', email: 'test@testemail.com'});
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
            var deleteStub = sinon.stub(userDAO, 'delete');

            return userBO.delete()
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
            var deleteStub = sinon.stub(userDAO, 'delete');

            return userBO.delete({})
                    .then()
                    .catch(function(error) {
                        expect(error.code).to.be.equals(422);
                        expect(error.message).to.be.equals('Id are required');
                        expect(deleteStub.callCount).to.be.equals(0);
                        expect(nowStub.callCount).to.be.equals(0);
                        deleteStub.restore();
                    });
        });

        it('Should delete a user', function(){
            var deleteStub = sinon.stub(userDAO, 'delete');
            deleteStub
                .withArgs({id: '5c088673fb2f579adcca9ed1'},{isEnabled: false, exclusionDate: date})
                .returns({});

            return userBO.delete({id: '5c088673fb2f579adcca9ed1'})
                    .then(function() {
                        expect(deleteStub.callCount).to.be.equals(1);
                        expect(nowStub.callCount).to.be.equals(1);
                        deleteStub.restore();
                    });
        });
    });
});
