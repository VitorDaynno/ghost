var mongoose = require('mongoose');
var request  = require('supertest');
var chai     = require('chai');
var expect   = chai.expect;

describe('users', function(){
  var server;
  var userId;
  var validToken;

  before(function(){
    server = require('../../src/server');
  });

  after(function(){
    mongoose.connection.close();
    server.close();
  });

  describe('v1/users/auth',function() {
    it('Should return error because body is empty', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({})
                .expect(422);
    });
    it('Should return error because email does not exist', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({password:'123'})
                .expect(422);
    });
    it('Should return error because password does not exist', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'test@mailtest.com'})
                .expect(422);
    });
    it('Should return error with incorrect password', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'test@mailtest.com', password: '123'})
                .expect(401);
    });
    it('Should return success with valid credentials', function(){
        return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({email:'admin@ghost.com.br', password: '1234'})
                .expect(200)
                .then(function(response){
                  expect(response.body.name).to.be.equal('admin');
                  expect(response.body.email).to.be.equal('admin@ghost.com.br');
                  expect(response.body.token).to.be.not.equal('');
                });
    });
  });

  describe('v1/users/:id', function() {
    describe('get', function(){
      it('Should return error because request not contain token auth', function(){
        return request(server)
            .get('/v1/users/error')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403);
      });
      it('Should return error because request contain a token invalid', function(){
          return request(server)
              .get('/v1/users/error')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
              .expect('Content-Type', /json/)
              .expect(403);
      });
      it('Should return a valid token to continue the validates', function(){
        return request(server)
                .post('/v1/users/auth')
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
                .get('/v1/users/error')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(422);
      });
      it('Should return a empty object because id does not exist', function(){
          return request(server)
                  .get('/v1/users/5bbead798c2a8a92339e88b7')
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .then(function(response){
                    expect(response.body).to.be.eqls({});
                  });
      });
      it('Should return user with valid entity', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test@emailtest.com', name:'test', password: '1234'})
                .expect(201)
                .then(function(response){
                  userId = response.body.id;
                });
      });
      it('Should return user with valid id', function(){
          return request(server)
                  .get('/v1/users/'+ userId)
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .then(function(response){
                    expect(response.body.name).to.be.equal('test');
                    expect(response.body.email).to.be.equal('test@emailtest.com');
                  });
      });
      it('Should return success when deleted a user', function(){
        return request(server)
                .delete('/v1/users/' + userId)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(200);
      });
    });

    describe('put', function(){
      it('Should return error because request not contain token auth', function(){
        return request(server)
            .put('/v1/users/error')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .send({name: 'Name'})
            .expect(403);
      });
      it('Should return error because request contain a token invalid', function(){
          return request(server)
              .put('/v1/users/error')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
              .expect('Content-Type', /json/)
              .send({name: 'Name'})
              .expect(403);
      });
      it('Should return a valid token to continue the validates', function(){
        return request(server)
                .post('/v1/users/auth')
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
                .put('/v1/users/error')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(422);
      });
      it('Should return a empty object because id does not exist', function(){
          return request(server)
                  .put('/v1/users/5bbead798c2a8a92339e88b7')
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .then(function(response){
                    expect(response.body).to.be.eqls({});
                  });
      });
      it('Should return user with valid entity', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test@emailtest.com', name:'test', password: '1234'})
                .expect(201)
                .then(function(response){
                  userId = response.body.id;
                });
      });
      it('Should return user when updated a user', function(){
          return request(server)
                  .put('/v1/users/' + userId)
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .send({name: 'changedName'})
                  .expect(200)
                  .then(function(response){
                    expect(response.body.id).to.be.equal(userId);
                    expect(response.body.name).to.be.equal('changedName');
                    expect(response.body.email).to.be.equal('test@emailtest.com');
                  });
      });
      it('Should return success when deleted a user', function(){
        return request(server)
                .delete('/v1/users/' + userId)
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(200);
      });
    });

    describe('delete', function(){
      it('Should return error because request not contain token auth', function(){
        return request(server)
            .delete('/v1/users/error')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(403);
      });
      it('Should return error because request contain a token invalid', function(){
          return request(server)
              .delete('/v1/users/error')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
              .expect('Content-Type', /json/)
              .expect(403);
      });
      it('Should return error because id is invalid', function(){
        return request(server)
                .delete('/v1/users/error')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .expect(422);
      });
      it('Should return a empty object because id does not exist', function(){
          return request(server)
                  .delete('/v1/users/5bbead798c2a8a92339e88b7')
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .expect(200)
                  .then(function(response){
                    expect(response.body).to.be.eqls({});
                  });
      });
      it('Should return user with valid entity', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test2@emailtest.com', name:'test', password: '1234'})
                .expect(201)
                .then(function(response){
                  userId = response.body.id;
                });
      });
      it('Should return success when deleted a user', function(){
          return request(server)
                  .delete('/v1/users/' + userId)
                  .set('Accept', 'application/json')
                  .set('Authorization', 'Bearer ' + validToken)
                  .expect('Content-Type', /json/)
                  .expect(200);
      });
    });
  });

  describe('v1/users',function() {
    it('Should return error because request not contain token auth', function(){
      return request(server)
          .post('/v1/users/')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(403);
    });
    it('Should return error because request contain a token invalid', function(){
        return request(server)
            .post('/v1/users/')
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
            .expect('Content-Type', /json/)
            .expect(403);
    });
    it('Should return a valid token to continue the validates', function(){
      return request(server)
              .post('/v1/users/auth')
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
                .post('/v1/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({})
                .expect(422);
    });
    it('Should return error because email does not exist', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({name: 'test', password:'123'})
                .expect(422);
    });
    it('Should return error because name does not exist', function(){
      return request(server)
              .post('/v1/users')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({email: 'test@emailtest.com', password:'123'})
              .expect(422);
    });
    it('Should return error because password does not exist', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test@mailtest.com', name: 'test'})
                .expect(422);
    });
    it('Should return user with valid entity', function(){
        return request(server)
                .post('/v1/users')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer ' + validToken)
                .expect('Content-Type', /json/)
                .send({email:'test@emailtest.com', name:'test', password: '1234'})
                .expect(201)
                .then(function(response){
                  userId = response.body.id;
                  expect(response.body.name).to.be.equal('test');
                  expect(response.body.email).to.be.equal('test@emailtest.com');
                  expect(response.body).to.not.have.property('password');
                });
    });
    it('Should return error because email already exist', function(){
      return request(server)
              .post('/v1/users')
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .send({email:'test@emailtest.com', name:'test', password: '1234'})
              .expect(409);
    });
    it('Should return success when deleted a user', function(){
      return request(server)
              .delete('/v1/users/' + userId)
              .set('Accept', 'application/json')
              .set('Authorization', 'Bearer ' + validToken)
              .expect('Content-Type', /json/)
              .expect(200);
    });
  });
});
