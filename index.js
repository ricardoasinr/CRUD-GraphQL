const {ApolloServer} = require('apollo-server');

const conectarDB = require('./config/db');
const typeDefs = require('./db/schemas');
const resolvers = require('./db/resolvers');

//Levantar la Base de Datos
conectarDB();

//Servidor
const servidor = new ApolloServer({
    typeDefs,
    resolvers
});

//Levantar el servidor
servidor.listen().then(({url}) =>{
    console.log(`Servidor listo en la URL ${url}`)
})