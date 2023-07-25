# Backend
Uma RESTful API Implementada com Node.js utilizando:
- Express para web framework
- MySQL para banco de dados

## Começando

### Requisitos:

- Node.js
- npm
- MySQL

### Instalação
Instalar dependências:
```sh
npm install
```
### Banco de dados
Configurando banco de dados:

1 - Abra o arquivo "db/index.js" na raiz do projeto.

2 - Procure pela variável "password" e substitua-a pela senha do seu banco de dados. Exemplo:
```sh
password: 'sua_senha_do_banco_de_dados'
```
3 - Em seguida, localize a variável "database" e altere o valor para o nome do banco de dados que você criou para a aplicação. Exemplo:
```sh
database: 'nome_do_seu_banco_de_dados'
```
4 - Caso ainda não tenha criado um banco de dados, crie um banco de dados no seu MySQL e siga os 3 passos acima.

### Testes

Rodar testes:

```sh
npm test
```

### Start API
Rode a API localmente com:
```sh
npm start
```

Isso deve resultar em:
- API disponível em: http://localhost:3000


