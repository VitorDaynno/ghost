const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const userModel = require('../../../src/models/user')();
const sinonMongoose = require('sinon-mongoose');

describe('Runner', function(){
    const date = new Date();

    describe('monitoring', function(){
        it('Should return status on and update the resource', function(){});
        it('Should return status off and update the resource', function(){});
        it('Should return status off and do not update the resource', function(){});
        it('Should return status on and do not update the resource', function(){});
        it('Should do nothing when there is not a resource', function(){});
    });

    describe('serverMonitoring', function(){
        it('Should return error because while pinging a invalid server', function(){});
        it('Should return status on ', function(){});
        it('Should return status off', function(){});
        it('Should return diferent status from the resource to be updated - on', function(){});
        it('Should return diferent status from the resource to be updated - off', function(){});
        it('Should do nothing when there is a empty resource', function(){});
    });

});
