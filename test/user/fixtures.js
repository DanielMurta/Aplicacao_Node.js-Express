const getValidUser = () => ({
    firstName: 'Lucas',
    lastName: 'Miranda',
    email: 'lucas@email.com',
    password_hash: 'ahd1dfv5v',
    cpf: '52368974582',
    birthDate: '1996-04-12'  
})

const existingUser = () => ({
    firstName: 'Daniel',
    lastName: 'Murta',
    email: 'daniel@email.com',
    password_hash: 'hgpo45897as',
    cpf: '15879635789',
    birthDate: '1996-04-12'  
})

const getValidProduct = () => ({  
    name: "product7",
    description: "description of product 7",
    price: 782.50 
})

module.exports = {
    getValidUser,
    existingUser,
    getValidProduct
}