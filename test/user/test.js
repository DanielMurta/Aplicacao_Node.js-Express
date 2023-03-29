const chai = require('chai')
const app = require('../../index')
const expect = chai.expect
const request = require('supertest')
const { getValidUser, existingUser } = require('./fixtures')
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
            .get('/user/59')
            .expect(404)
            .end((err, res) => {
                if (err) done(err)
                done()
            })
    })

    it('POST /user/login should return 200 if login is successfuly', (done) => {
        const {email, password_hash} = existingUser()
        request(app)
            .post('/user/login')
            .send({email, password_hash})
            .expect(200)
            .expect('Content-Type', /json/)
            .end((err, res) => {
                if (err) {
                    done(err)
                } else {
                    done()
                }
            })
    })

    it('POST /user/login should return 404 if user is not found', (done) => {
        const {email} = existingUser()
        const password_hash = '123'
        request(app)
            .post('/user/login')
            .send({email, password_hash})
            .expect(404)
            .end((err, res) => {
                if (err) {
                    done(err)
                } else {
                    done()
                }
            })
    })
})
