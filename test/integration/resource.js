const mongoose = require('mongoose');
const request = require('supertest');
const chai = require('chai');
const mocha = require('mocha');
const server = require('../../src/server');

const { expect } = chai;
const {
    describe,
    it,
    after,
} = mocha;

describe('resorces', () => {
    let resorceId;
    let validToken;

    after(() => {
        mongoose.connection.close();
        server.close();
    });

    describe('v1/resorces/:id', () => {
        describe('get', () => {
            it('Should return error because request not contain token auth', () => {
                return request(server)
                    .get('/v1/resorces/error')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403);
            });
            it('Should return error because request contain a token invalid', () => {
                return request(server)
                    .get('/v1/resorces/error')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
                    .expect('Content-Type', /json/)
                    .expect(403);
            });
            it('Should return a valid token to continue the validates', () => {
                return request(server)
                    .post('/v1/resorces/auth')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .send({ email: 'admin@ghost.com.br', password: '1234' })
                    .expect(200)
                    .then((response) => {
                        validToken = response.body.token;
                    });
            });
            it('Should return error because id is invalid', () => {
                return request(server)
                    .get('/v1/resorces/error')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(422);
            });
            it('Should return a empty object because id does not exist', () => {
                return request(server)
                    .get('/v1/resorces/5bbead798c2a8a92339e88b7')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                        expect(response.body).to.be.eqls({});
                    });
            });
            it('Should return resorce with valid entity', () => {
                return request(server)
                    .post('/v1/resorces')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .send({
                        name: 'resource-test',
                        type: 'server',
                        data: {},
                        status: 'off',
                    })
                    .expect(201)
                    .then((response) => {
                        resorceId = response.body.id;
                    });
            });
            it('Should return resorce with valid id', () => {
                return request(server)
                    .get(`/v1/resorces/${resorceId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                        expect(response.body.name).to.be.equal('resource-test');
                        expect(response.body.type).to.be.equal('server');
                        expect(response.body.data).to.be.eql({});
                        expect(response.body.status).to.be.equal('off');
                    });
            });
            it('Should return success when deleted a resorce', () => {
                return request(server)
                    .delete(`/v1/resorces/${resorceId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200);
            });
        });

    describe('put', function(){
      it('Should return error because request not contain token auth', function(){
        return request(server)
            .put('/v1/resorces/error')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({name: 'Name'})
            .expect(403);
      });
      it('Should return error because request contain a token invalid', function(){
          return request(server)
              .put('/v1/resorces/error')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
              .expect('Content-Type', /json/)
              .send({name: 'Name'})
              .expect(403);
      });
      it('Should return a valid token to continue the validates', function(){
        return request(server)
                .post('/v1/resorces/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'admin@ghost.com.br', password: '1234'})
                .expect(200)
                .then(function(response){
                    validToken = response.body.token;
                });
      });
      it('Should return error because id is invalid', function(){
        return request(server)
                .put('/v1/resorces/error')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(422);
      });
      it('Should return a empty object because id does not exist', function(){
          return request(server)
                  .put('/v1/resorces/5bbead798c2a8a92339e88b7')
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .then(function(response){
                    expect(response.body).to.be.eqls({});
                  });
      });
      it('Should return resorce with valid entity', function(){
        return request(server)
                .post('/v1/resorces')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test@emailtest.com', name:'test', password: '1234'})
                .expect(201)
                .then(function(response){
                  resorceId = response.body.id;
                });
      });
      it('Should return resorce when updated a resorce', function(){
          return request(server)
                  .put('/v1/resorces/' + resorceId)
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .send({name: 'changedName'})
                  .expect(200)
                  .then(function(response){
                    expect(response.body.id).to.be.equal(resorceId);
                    expect(response.body.name).to.be.equal('changedName');
                    expect(response.body.email).to.be.equal('test@emailtest.com');
                  });
      });
      it('Should return success when deleted a resorce', function(){
        return request(server)
                .delete('/v1/resorces/' + resorceId)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(200);
      });
    });

    describe('delete', function(){
      it('Should return error because request not contain token auth', function(){
        return request(server)
            .delete('/v1/resorces/error')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403);
      });
      it('Should return error because request contain a token invalid', function(){
          return request(server)
              .delete('/v1/resorces/error')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
              .expect('Content-Type', /json/)
              .expect(403);
      });
      it('Should return error because id is invalid', function(){
        return request(server)
                .delete('/v1/resorces/error')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(422);
      });
      it('Should return a empty object because id does not exist', function(){
          return request(server)
                  .delete('/v1/resorces/5bbead798c2a8a92339e88b7')
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .then(function(response){
                    expect(response.body).to.be.eqls({});
                  });
      });
      it('Should return resorce with valid entity', function(){
        return request(server)
                .post('/v1/resorces')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test2@emailtest.com', name:'test', password: '1234'})
                .expect(201)
                .then(function(response){
                  resorceId = response.body.id;
                });
      });
      it('Should return success when deleted a resorce', function(){
          return request(server)
                  .delete('/v1/resorces/' + resorceId)
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .expect(200);
      });
    });
  });

  describe('v1/resorces',function() {
    it('Should return error because request not contain token auth', function(){
      return request(server)
          .post('/v1/resorces/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(403);
    });
    it('Should return error because request contain a token invalid', function(){
        return request(server)
            .post('/v1/resorces/')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
            .expect('Content-Type', /json/)
            .expect(403);
    });
    it('Should return a valid token to continue the validates', function(){
      return request(server)
              .post('/v1/resorces/auth')
              .set('Accept', 'application/json')
              .expect('Content-Type', /json/)
              .send({email:'admin@ghost.com.br', password: '1234'})
              .expect(200)
              .then(function(response){
                  validToken = response.body.token;
              });
    });
    it('Should return error because body is empty', function(){
        return request(server)
                .post('/v1/resorces')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({})
                .expect(422);
    });
    it('Should return error because email does not exist', function(){
        return request(server)
                .post('/v1/resorces')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({name: 'test', password:'123'})
                .expect(422);
    });
    it('Should return error because name does not exist', function(){
      return request(server)
              .post('/v1/resorces')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({email: 'test@emailtest.com', password:'123'})
              .expect(422);
    });
    it('Should return error because password does not exist', function(){
        return request(server)
                .post('/v1/resorces')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test@mailtest.com', name: 'test'})
                .expect(422);
    });
    it('Should return resorce with valid entity', function(){
        return request(server)
                .post('/v1/resorces')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test@emailtest.com', name:'test', password: '1234'})
                .expect(201)
                .then(function(response){
                  resorceId = response.body.id;
                  expect(response.body.name).to.be.equal('test');
                  expect(response.body.email).to.be.equal('test@emailtest.com');
                  expect(response.body).to.not.have.property('password');
                });
    });
    it('Should return error because email already exist', function(){
      return request(server)
              .post('/v1/resorces')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({email:'test@emailtest.com', name:'test', password: '1234'})
              .expect(409);
    });
    it('Should return success when deleted a resorce', function(){
      return request(server)
              .delete('/v1/resorces/' + resorceId)
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .expect(200);
    });
  });
});
