const chai = require('chai')
const app = require('../../index')
const expect = chai.expect
const request = require('supertest')
const { getValidUser, existingUser, getValidProduct } = require('./fixtures')
const { response } = require('../../index')

describe('User test Integration', () => {
    it('POST /user/save Should return 201 if user is created', async () => {
        const user = getValidUser()
        await request(app)
            .post('/user/save')
            .send(user)
            .expect(201)
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

    it('POST /:Userid/product should return 201 if product was created by user id', async () => {
        const {email, password_hash} = existingUser()
        const {name, description, price} = getValidProduct()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token
        
        await request(app)
            .post('/user/2/product')
            .send({name, description, price})
            .set(`x-access-token`, `${token}`)
            .expect(201)
    })

    it('GET /user/:id Should return 200 if return user', async () => {
        const {email, password_hash} = existingUser()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .get('/user/1')
            .set(`x-access-token`, `${token}`)
            .expect(200)
    })
    
    it('GET /user/:id Should return 404 if invalid id', async () => {
        const {email, password_hash} = existingUser()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .get('/user/10245')
            .set(`x-access-token`, `${token}`)
            .expect(404)
    })

    it('GET /user/clients Should return 200 if return users', async () => {
        const { email, password_hash } = existingUser()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .get('/user/clients')
            .set(`x-access-token`, `${token}`)
            .expect(200)
    })

    it('GET /user/clients Should return 401 if unauthorized', async () => {
        const token = '1234'

        await request(app)
            .get('/user/clients')
            .set(`x-access-token`, `${token}`)
            .expect(401)
    })

    it('GET /user/clients Should return 403 if no admin', async () => {
        const { email, password_hash } = { 
            email: 'joao@email.com', 
            password_hash: 'hgpo45897as'
        }

        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .get('/user/clients')
            .set(`x-access-token`, `${token}`)
            .expect(403)
    })

    it('GET /user/users should return 200 if pagination is work', async () => {
        const { email, password_hash } = { 
            email: 'joao@email.com', 
            password_hash: 'hgpo45897as'
        }

        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .get('/user/users')
            .set(`x-access-token`, `${token}`)
            .expect(200)
            
    })

    it('GET /user/:Userid/Allproducts should return 200 if all products was return by user id', async () => {
        const { email, password_hash } = { 
            email: 'joao@email.com', 
            password_hash: 'hgpo45897as'
        }

        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .get('/user/77/Allproducts')
            .set(`x-access-token`, `${token}`)
            .expect(200)
    })

    it('GET /user/:Userid/Allproducts should return 404 if products was not found', async () => {
        const { email, password_hash } = { 
            email: 'joao@email.com', 
            password_hash: 'hgpo45897as'
        }

        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .get('/user/789/Allproducts')
            .set(`x-access-token`, `${token}`)
            .expect(404)
    })
    
    it('DELETE /user/delete/:id should return 204 if user was deleted', async () => {
        const { email, password_hash } = existingUser()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .delete('/user/delete/59')
            .set(`x-access-token`, `${token}`)
            .expect(204)
    })

    it('DELETE /user/delete/:id should return 401 if unauthorized', async () => {
        const token = '1234'

        await request(app)
            .delete('/user/delete/23')
            .set(`x-access-token`, `${token}`)
            .expect(401)
    })

    it('DELETE /user/delete/:id should return 403 if user is not admin', async () => {
        const { email, password_hash } = { 
            email: 'joao@email.com', 
            password_hash: 'hgpo45897as'
        }
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .delete('/user/delete/23')
            .set(`x-access-token`, `${token}`)
            .expect(403)
    })

    it('UPDATE /edit/:id should return 200 if user was updated', async() => {
        const { email, password_hash } = { 
            email: 'joao@email.com', 
            password_hash: 'hgpo45897as'
        }

        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        await request(app)
            .put('/user/edit/60')
            .set(`x-access-token`, `${token}`)
            .send({ firstName: 'Pedro', lastName: 'Silva', email: 'pedro22@email.com',
            password_hash: 'dc5d1c5d', cpf: '86578324984', birthDate: '2004-04-02'})
            .expect(200)
    })

    it('UPDATE /edit/:id should return 404 if user was not found', async() => {
        const { email, password_hash } = { 
            email: 'joao@email.com', 
            password_hash: 'hgpo45897as'
        }

        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        const response = await request(app)
            .put('/user/edit/11258g')
            .set(`x-access-token`, `${token}`)
            .send({ lastName: 'Silva' })
            .expect(404)
    })

    it('UPDATE /editRole/:id should return 200 if user was updated to admin', async () => {
        const { email, password_hash } = existingUser()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        const response = await request(app)
            .put('/user/editRole/51')
            .set(`x-access-token`, `${token}`)
            .expect(200)
    })

    it('UPDATE /editRole/:id should return 404 if user was not found', async () => {
        const { email, password_hash } = existingUser()
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        const response = await request(app)
            .put('/user/editRole/10897')
            .set(`x-access-token`, `${token}`)
            .expect(404)
    })

    it('UPDATE /editRole/:id should return 403 if user is not admin', async () => {
        const { email, password_hash } = { 
            email: 'joao@email.com', 
            password_hash: 'hgpo45897as'
        }
        const { body } = await request(app)
            .post('/user/login')
            .send({email, password_hash})

        const token = body.token

        const response = await request(app)
            .put('/user/editRole/10897')
            .set(`x-access-token`, `${token}`)
            .expect(403)
    })

})
