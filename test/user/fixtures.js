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

module.exports = {
    getValidUser,
    existingUser,
}