var chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
var UserDAO = require('../../../src/daos/userDAO');
var userModel = require('../../../src/models/user')();
var DateHelper = require('../../../src/helpers/dateHelper');
var sinonMongoose = require('sinon-mongoose');

describe('userDAO', function(){

    var userDAO = new UserDAO({
        user: userModel
    });

    var date = new Date();

    describe('save', function(){
        it('Should return error because object is empty', function(){
            var createStub = sinon.mock(userModel).expects('create')
                .withArgs({})
                .rejects();

            return userDAO.save({})
                .then()
                .catch(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object not contains email', function(){
            var createStub = sinon.mock(userModel).expects('create')
                .withArgs({name: 'test', password: '123', creationDate: DateHelper.now()})
                .rejects();

            return userDAO.save({name: 'test', password: '123', creationDate: DateHelper.now()})
                .then()
                .catch(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object not contains name', function(){
            var createStub = sinon.mock(userModel).expects('create')
                .withArgs({email: 'email@test.com', password: '123', creationDate: date})
                .rejects();

            return userDAO.save({email: 'email@test.com', password: '123', creationDate: date})
                .then()
                .catch(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return error because object not contains password', function(){
            var createStub = sinon.mock(userModel).expects('create')
                .withArgs({email: 'email@test.com', name: 'test', creationDate: DateHelper.now()})
                .rejects();

            return userDAO.save({email: 'email@test.com', name: 'test', creationDate: DateHelper.now()})
                .then()
                .catch(function(){
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a user with success', function(){
            var createStub = sinon.mock(userModel).expects('create')
                .withArgs({email: 'email@test.com', name: 'test', password: '123', creationDate: date})
                .resolves({_id: '5c05e59193a46d0d7464bdde', email: 'email@test.com', name: 'test', password: '123', creationDate: date});

            return userDAO.save({email: 'email@test.com', name: 'test', password: '123', creationDate: date})
                .then(function(user){
                    expect(user._id).to.be.equal('5c05e59193a46d0d7464bdde');
                    expect(user.email).to.be.equal('email@test.com');
                    expect(user.name).to.be.equal('test');
                    expect(user.password).to.be.equal('123');
                    expect(user.creationDate).to.be.equal(date);
                    expect(createStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getAll', function(){
        it('Should return empty object when email dont exist', function(){
            var findStub = sinon.mock(userModel).expects('find')
                .withArgs({email:'email@test.com', password:'123', creationDate: DateHelper.now()})
                .chain('exec')
                .resolves({});

            return userDAO.getAll({email:'email@test.com', password:'123', creationDate: DateHelper.now()})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return empty object when password dont exist', function(){
            var findStub = sinon.mock(userModel).expects('find')
                .withArgs({email:'test@test.com', password:'1234', creationDate: DateHelper.now()})
                .chain('exec')
                .resolves({});

            return userDAO.getAll({email:'test@test.com', password:'1234', creationDate: DateHelper.now()})
                .then(function(){
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a user when credentials exist', function(){
            var findStub = sinon.mock(userModel).expects('find')
                .withArgs({email:'test@test.com', password:'123', creationDate: DateHelper.now()})
                .chain('exec')
                .resolves({name: 'test', email: 'test@test.com'});

            return userDAO.getAll({email:'test@test.com', password:'123', creationDate: DateHelper.now()})
                .then(function(user){
                    expect(user.name).to.be.equals('test');
                    expect(user.email).to.be.equals('test@test.com');
                    expect(findStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('getById', function(){
        it('Should return empty object when id dont exist', function(){
            var findByStub = sinon.mock(userModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b7')
                .chain('exec')
                .resolves({});

            return userDAO.getById('5bbead798c2a8a92339e88b7')
                .then(function(){
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });

        it('Should return a user when id exist', function(){
            var findByStub = sinon.mock(userModel).expects('findById')
                .withArgs('5bbead798c2a8a92339e88b8')
                .chain('exec')
                .resolves({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com', creationDate: date});

            return userDAO.getById('5bbead798c2a8a92339e88b8')
                .then(function(user){
                    expect(user).to.be.eqls({_id: '5bbead798c2a8a92339e88b8', name: 'test', email: 'test@mailtest.com', creationDate: date});
                    expect(findByStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('update', function(){
        it('Should return error because id is empty', function(){
            var updateStub = sinon.mock(userModel).expects('findByIdAndUpdate')
                .withArgs({})
                .rejects();

            return userDAO.update('', {})
                .then()
                .catch(function(){
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should return error because body is empty', function(){
            var updateStub = sinon.mock(userModel).expects('findByIdAndUpdate')
                .withArgs({})
                .rejects();

            return userDAO.update('5c088673fb2f579adcca9ed1', {})
                .then()
                .catch(function(){
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should return a user when updated', function(){
            var updateStub = sinon.mock(userModel).expects('findByIdAndUpdate')
                .withArgs('5c088673fb2f579adcca9ed1', {$set: {name: 'changedName', modificationDate: DateHelper.now()}}, {new: true})
                .resolves({_id: '5c088673fb2f579adcca9ed1', name: 'changedName', email: 'test@mailtest.com', creationDate: DateHelper.now(), modificationDate: DateHelper.now()});

            return userDAO.update('5c088673fb2f579adcca9ed1', {name: 'changedName', modificationDate: DateHelper.now()})
                .then(function(){
                    expect(updateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });

    describe('delete', function(){
        it('Should return error because id is empty', function(){
            var updateStub = sinon.mock(userModel).expects('update')
                .withArgs({})
                .rejects();

            return userDAO.delete()
                .then()
                .catch(function(){
                    expect(updateStub.callCount).to.be.equals(0);
                    sinon.restore();
                });
        });

        it('Should delete a user when id is correct', function(){
            var updateStub = sinon.mock(userModel).expects('update')
                .withArgs({_id: '5c088673fb2f579adcca9ed1'}, {isEnabled: false, exclusionDate: DateHelper.now()})
                .resolves({_id: '5c088673fb2f579adcca9ed1', name: 'test', email: 'test@mailtest.com', isEnabled: false, creationDate: DateHelper.now(), exclusionDate: DateHelper.now()});

            return userDAO.delete('5c088673fb2f579adcca9ed1', {isEnabled: false, exclusionDate: DateHelper.now()})
                .then(function(){
                    expect(updateStub.callCount).to.be.equals(1);
                    sinon.restore();
                });
        });
    });
});
