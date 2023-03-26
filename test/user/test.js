const chai = require('chai')
const app = require('../../index')
const expect = chai.expect
const request = require('supertest')
const { getValidUser } = require('./fixtures')
const { response } = require('../../index')

describe('User test Integration', () => {
    it('POST /user/save Should return 201 if user is created', (done) => {
        const user = getValidUser()
        request(app)
            .post('/user/save')
            .send(user)
            .expect(201)
            .end((err, res) => {
                if (err) done(err)
                done()
              })
    })

    it('GET /user/:id Should return 200 if return user', (done) => {
        request(app)
            .get('/user/1')
            .expect(200)
            .end((err, res) => {
                if (err) done(err)
                done()
            })
    })
    
    it('GET /user/:id Should return 404 if invalid id', (done) => {
        request(app)
            .get('/user/8')
            .expect(404)
            .end((err, res) => {
                if (err) done(err)
                done()
            })
    })
})
