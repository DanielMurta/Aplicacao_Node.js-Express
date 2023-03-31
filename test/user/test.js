const chai = require('chai')
const app = require('../../index')
const expect = chai.expect
const request = require('supertest')
const { getValidUser, existingUser } = require('./fixtures')
const { response } = require('../../index')

describe('User test Integration', () => {
    it('POST /user/save Should return 201 if user is created', async () => {
        const user = getValidUser()
        await request(app)
            .post('/user/save')
            .send(user)
            .expect(201)
    })

    it('GET /user/:id Should return 200 if return user', async () => {
        await request(app)
            .get('/user/1')
            .expect(200)
    })
    
    it('GET /user/:id Should return 404 if invalid id', async () => {
        await request(app)
            .get('/user/10245')
            .expect(404)
    })

    it('GET /user/clients Should return 200 if return users', async () => {
        const { email, password_hash } = existingUser()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        request(app)
            .get('/user/clients')
            .set(`x-access-token`, `${token}`)
            .expect(200)
    })

    it('GET /user/clients Should return 401 if return users', async () => {
        const token = '1234'

        request(app)
            .get('/user/clients')
            .set(`x-access-token`, `${token}`)
            .expect(401)
    })

    it('POST /user/login should return 200 if login is successfuly', async () => {
        const {email, password_hash} = existingUser()
        await request(app)
            .post('/user/login')
            .send({email, password_hash})
            .expect(200)
            .expect('Content-Type', /json/)
            
    })

    it('POST /user/login should return 404 if user is not found', async () => {
        const {email} = existingUser()
        const password_hash = '123'
        await request(app)
            .post('/user/login')
            .send({email, password_hash})
            .expect(404)
           
    })
    
    it('DELETE /user/login should return 204 IF user was deleted', async () => {
        const { email, password_hash } = existingUser()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .delete('/user/delete/23')
            .set(`x-access-token`, `${token}`)
            .expect(204)
    })

    it('DELETE /user/login should return 401 IF user was deleted', async () => {
        const token = '1234'

        await request(app)
            .delete('/user/delete/23')
            .set(`x-access-token`, `${token}`)
            .expect(401)
    })

})
