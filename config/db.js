const {ApolloServer} = require('apollo-server');
const mongoose = require('mongoose');

require('dotenv').config({path:'variables.env'});

const conectarDB = async ()=> {
    try {
        await mongoose.connect(process.env.DB_MONGO, {

        }, ()=> '')
        console.log('Base de Datos Conectada!')
    } catch (error){
        console.log('Error al conectar la Base de Datos');
        console.log(error);
        process.exit(1);
    }
}

module.exports = conectarDB;