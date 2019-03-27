const request = require('supertest');
const chai = require('chai');
const mocha = require('mocha');
const server = require('../../src/server');
const factory = require('../../src/factories/factoryBO');

const { expect } = chai;
const {
    describe,
    it,
    before,
    after,
} = mocha;

describe('resources', () => {
    let resourceId;
    let validToken;

    before(() => {
        const user = factory.getBO('user');
        user.save({ name: 'admin', email: 'admin@ghost.com.br', password: '1234' });
    });
    after(() => {
        server.close();
    });

    describe('v1/resources/:id', () => {
        describe('get', () => {
            it('Should return error because request not contain token auth', () => {
                return request(server)
                    .get('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403);
            });
            it('Should return error because request contain a token invalid', () => {
                return request(server)
                    .get('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
                    .expect('Content-Type', /json/)
                    .expect(403);
            });
            it('Should return a valid token to continue the validates', () => {
                return request(server)
                    .post('/v1/users/auth')
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
                    .get('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(422);
            });
            it('Should return a empty object because id does not exist', () => {
                return request(server)
                    .get('/v1/resources/5bbead798c2a8a92339e88b7')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                        expect(response.body).to.be.eqls({});
                    });
            });
            it('Should return resource with valid entity', () => {
                return request(server)
                    .post('/v1/resources')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .send({
                        name: 'resource-test',
                        type: 'server',
                        data: {
                            url: 'url',
                        },
                        status: 'off',
                    })
                    .expect(201)
                    .then((response) => {
                        resourceId = response.body.id;
                    });
            });
            it('Should return resource with valid id', () => {
                return request(server)
                    .get(`/v1/resources/${resourceId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                        expect(response.body.name).to.be.equal('resource-test');
                        expect(response.body.type).to.be.equal('server');
                        expect(response.body.data).to.be.eql({ url: 'url' });
                        expect(response.body.status).to.be.equal('off');
                    });
            });
            it('Should return success when deleted a resource', () => {
                return request(server)
                    .delete(`/v1/resources/${resourceId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200);
            });
        });

        describe('put', () => {
            it('Should return error because request not contain token auth', () => {
                return request(server)
                    .put('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .send({ name: 'resource' })
                    .expect(403);
            });
            it('Should return error because request contain a token invalid', () => {
                return request(server)
                    .put('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
                    .expect('Content-Type', /json/)
                    .send({ name: 'resource' })
                    .expect(403);
            });
            it('Should return a valid token to continue the validates', () => {
                return request(server)
                    .post('/v1/users/auth')
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
                    .put('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(422);
            });
            it('Should return a empty object because id does not exist', () => {
                return request(server)
                    .put('/v1/resources/5bbead798c2a8a92339e88b7')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .send({ name: 'resource-test' })
                    .then((response) => {
                        expect(response.body).to.be.eqls({});
                    });
            });
            it('Should return resource with valid entity', () => {
                return request(server)
                    .post('/v1/resources')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .send({
                        name: 'resource-test',
                        type: 'database',
                        data: {},
                        status: 'on',
                    })
                    .expect(201)
                    .then((response) => {
                        resourceId = response.body.id;
                    });
            });
            it('Should return resource when updated a resource', () => {
                return request(server)
                    .put(`/v1/resources/${resourceId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .send({ name: 'changeResource' })
                    .expect(200)
                    .then((response) => {
                        expect(response.body.id).to.be.equal(resourceId);
                        expect(response.body.name).to.be.equal('changeResource');
                    });
            });
            it('Should return success when deleted a resource', () => {
                return request(server)
                    .delete(`/v1/resources/${resourceId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200);
            });
        });

        describe('delete', () => {
            it('Should return error because request not contain token auth', () => {
                return request(server)
                    .delete('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .expect(403);
            });
            it('Should return error because request contain a token invalid', () => {
                return request(server)
                    .delete('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
                    .expect('Content-Type', /json/)
                    .expect(403);
            });
            it('Should return error because id is invalid', () => {
                return request(server)
                    .delete('/v1/resources/error')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(422);
            });
            it('Should return a empty object because id does not exist', () => {
                return request(server)
                    .delete('/v1/resources/5bbead798c2a8a92339e88b7')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .then((response) => {
                        expect(response.body).to.be.eqls({});
                    });
            });
            it('Should return resource with valid entity', () => {
                return request(server)
                    .post('/v1/resources')
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .send({
                        name: 'resource-test',
                        type: 'database',
                        data: {},
                        status: 'on',
                    })
                    .expect(201)
                    .then((response) => {
                        resourceId = response.body.id;
                    });
            });
            it('Should return success when deleted a resource', () => {
                return request(server)
                    .delete(`/v1/resources/${resourceId}`)
                    .set('Accept', 'application/json')
                    .set('Authorization', `Bearer ${validToken}`)
                    .expect('Content-Type', /json/)
                    .expect(200);
            });
        });
    });

    describe('v1/resources', () => {
        it('Should return error because request not contain token auth', () => {
            return request(server)
                .post('/v1/resources/')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(403);
        });
        it('Should return error because request contain a token invalid', () => {
            return request(server)
                .post('/v1/resources/')
                .set('Accept', 'application/json')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidGVzdCIsImlkIjoiMTEyIiwiaWF0IjoxNTE2MjM5MDIyfQ.RJBEFPnHm-t8-aMeHNkC7n9RocfTOHyKVCBWU2ogOTs')
                .expect('Content-Type', /json/)
                .expect(403);
        });
        it('Should return a valid token to continue the validates', () => {
            return request(server)
                .post('/v1/users/auth')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .send({ email: 'admin@ghost.com.br', password: '1234' })
                .expect(200)
                .then((response) => {
                    validToken = response.body.token;
                });
        });
        it('Should return error because body is empty', () => {
            return request(server)
                .post('/v1/resources')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .send({})
                .expect(422);
        });
        it('Should return error because name does not exist', () => {
            return request(server)
                .post('/v1/resources')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .send({
                    type: 'database',
                    data: {},
                    status: 'on',
                })
                .expect(422);
        });
        it('Should return error because type does not exist', () => {
            return request(server)
                .post('/v1/resources')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 'resource-test',
                    data: {},
                    status: 'on',
                })
                .expect(422);
        });
        it('Should return error because data does not exist', () => {
            return request(server)
                .post('/v1/resources')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 'resource-test',
                    type: 'database',
                    status: 'on',
                })
                .expect(422);
        });
        it('Should return error because status does not exist', () => {
            return request(server)
                .post('/v1/resources')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                })
                .expect(422);
        });
        it('Should return resource with valid entity', () => {
            return request(server)
                .post('/v1/resources')
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .send({
                    name: 'resource-test',
                    type: 'database',
                    data: {},
                    status: 'on',
                })
                .expect(201)
                .then((response) => {
                    resourceId = response.body.id;
                    expect(response.body.name).to.be.equal('resource-test');
                    expect(response.body.type).to.be.equal('database');
                    expect(response.body.data).to.be.eql({});
                    expect(response.body.status).to.be.equal('on');
                });
        });
        it('Should return success when deleted a resource', () => {
            return request(server)
                .delete(`/v1/resources/${resourceId}`)
                .set('Accept', 'application/json')
                .set('Authorization', `Bearer ${validToken}`)
                .expect('Content-Type', /json/)
                .expect(200);
        });
    });
});
