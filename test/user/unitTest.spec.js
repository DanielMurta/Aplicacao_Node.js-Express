const chai = require('chai')
const app = require('../../index')
const expect = chai.expect
const request = require('supertest')
const { getValidProduct } = require('./fixtures')

describe('Create User', () => {
    it('Should be possible create a user', async () => {
        const response = await request(app)
            .post('/user/save')
            .send(({
                firstName: 'Tomas',
                lastName: 'Garcia',
                email: 'tomas@email.com',
                password_hash: 'a5sc1df12v',
                cpf: '52368974785',
                birthDate: '2004-09-07'  
            }))

        expect(response.status).equal(201)
    })

    
    it('Should be possible create a product by user id', async () => {
        const { name, description, price } = getValidProduct()
        const { body } = await request(app)
            .post('/user/login')
            .send(({
                email: 'tomas@email.com',
                password_hash: 'a5sc1df12v',               
            }))

        const token = body.token

        const response = await request(app)
            .post('/user/1/product')
            .send({ name, description, price })
            .set(`x-access-token`, `${token}`)
        
        expect(response.status).equal(201)
        expect(response.request._data).to.be.an('object')
        expect(response.request._data["name"]).to.be.a('string')
        expect(response.request._data["name"]).equal(name)
        expect(response.request._data["description"]).to.be.a('string')
        expect(response.request._data["description"]).equal(description)
        expect(response.request._data["price"]).to.be.a('number')
        expect(response.request._data["price"]).equal(price)
    })
})

describe('Login user', () => {
    it('Should be possible login user ', async () => {
        const response = await request(app)
            .post('/user/login')
            .send(({
                email: 'tomas@email.com',
                password_hash: 'a5sc1df12v',               
            }))
    
        expect(response.status).equal(200)
        expect(response.body).to.be.an('object')
        expect(response.body["auth"]).to.be.true
        expect(response.body["token"]).to.be.a('string')
    })   
})

describe('Get users', () => {
    it('Should be possible return all users', async () => {
        const { body } = await request(app)
            .post('/user/login')
            .send(({
                email: 'gabrielb@email.com',
                password_hash: 'cd5cd51',               
            }))

        const token = body.token

        const response = await request(app)
            .get('/user/clients')
            .set(`x-access-token`, `${token}`)

        expect(response.status).equal(200)
        expect(response.body).to.be.an('array')
    })

    it('Should be possible return user by id', async () => {
        const { body } = await request(app)
            .post('/user/login')
            .send({
                email: 'tomas@email.com',
                password_hash: 'a5sc1df12v',
            })

        const token = body.token

        const response = await request(app)
            .get('/user/1')
            .set(`x-access-token`, `${token}`)

        expect(response.status).equal(200)
        expect(response.body).to.be.an('object')
        expect(response.body["id"]).to.be.a('number')
        expect(response.body["firstName"]).to.be.a('string')
        expect(response.body["lastName"]).to.be.a('string')
        expect(response.body["email"]).to.be.a('string')
        expect(response.body["password_hash"]).to.be.a('string')
        expect(response.body["birthDate"]).to.be.a('string')
        expect(response.body["role"]).to.be.a('string')
    })

    it('Should be possible return users with pagination', async () => {
        const { body } = await request(app)
            .post('/user/login')
            .send({
                email: 'tomas@email.com',
                password_hash: 'a5sc1df12v',
            })

        const token = body.token

        const response = await request(app)
            .get('/user/users')
            .set(`x-access-token`, `${token}`)

        expect(response.status).equal(200)
        expect(response.body).to.be.a('array')
    })

    it('Should be possible return products by user id', async () => {
        const { body } = await request(app)
            .post('/user/login')
            .send({
                email: 'tomas@email.com',
                password_hash: 'a5sc1df12v',
            })

        const token = body.token

        const response = await request(app)
            .get('/user/1/Allproducts')
            .set(`x-access-token`, `${token}`)

        expect(response.status).equal(200)
        expect(response.body).to.be.a('array')
        expect(response.body[0]["user_id"]).equal(1)
        expect(response.body[0]["name"]).to.be.a('string')
        expect(response.body[0]["description"]).to.be.a('string')
        expect(response.body[0]["price"]).to.be.a('string')
    })

})

describe('Delete user', () => {
    it('Should be possible delete user by id', async () => {
        const { body } = await request(app)
            .post('/user/login')
            .send({
                email: 'daniel@email.com',
                password_hash: 'hgpo45897as',
            })
    
        const token = body.token
    
        const response = await request(app)
            .delete('/user/delete/999')
            .set(`x-access-token`, `${token}`)
    
        expect(response.status).equal(204)
    })  
})

describe('Edite user', () => {
    it('Should be possible edit user by id', async () => {
        const { body } = await request(app)
            .post('/user/login')
            .send({
                email: 'daniel@email.com',
                password_hash: 'hgpo45897as',
            })
    
        const token = body.token
    
        const response = await request(app)
            .put('/user/edit/68')
            .send({ firstName: 'Pedro', lastName: 'Silva', email: 'pedro22@email.com',
             password_hash: 'dc5d1c5d', cpf: '86578324984', birthDate: '2004-04-02'})
            .set(`x-access-token`, `${token}`)
    
        expect(response.status).equal(200)
        expect(response.request._data["firstName"]).equal('Pedro')
        expect(response.request._data["firstName"]).to.be.a('string')
        expect(response.request._data["lastName"]).to.be.a('string')
        expect(response.request._data["lastName"]).equal('Silva')
        expect(response.request._data["email"]).to.be.a('string')
        expect(response.request._data["email"]).equal('pedro22@email.com')
        expect(response.request._data["password_hash"]).to.be.a('string')
        expect(response.request._data["password_hash"]).equal('dc5d1c5d')
        expect(response.request._data["cpf"]).to.be.a('string')
        expect(response.request._data["cpf"]).equal('86578324984')
        expect(response.request._data["birthDate"]).to.be.a('string')
        expect(response.request._data["birthDate"]).equal('2004-04-02')
        expect(response.body["affectedRows"]).equal(1)
    })

    it('Should be possible edit role user to admin by id', async () => {
        const { body } = await request(app)
            .post('/user/login')
            .send({
                email: 'daniel@email.com',
                password_hash: 'hgpo45897as',
            })
    
        const token = body.token
    
        const response = await request(app)
            .put('/user/editRole/68')
            .set(`x-access-token`, `${token}`)
    
        expect(response.status).equal(200)
        expect(response.body["affectedRows"]).equal(1)
    })  
})