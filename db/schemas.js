const { gql } = require('apollo-server');

//GraphQL
const typeDefs = gql `
    #Modelos
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        creado: String
    }
    
    type Producto {
        id: ID
        nombre: String
        existencia: Int
        precio: Float
        creado: String
    }

    #Inputs
    input inputUsuario {
        nombre: String
        apellido: String
        email: String
        password: String
    }  
    
    input inputProducto {
        nombre: String!
        existencia: Int!
        precio: Float!
    }
    
    input inputActualizarProducto {
    id: ID!
    nombre: String
    existencia: Int
    precio: Float
}

    
    
    type Token {
        token: String  
    }
    
    type Query {
        obtenerUsuario(token: String): Usuario
        obtenerProductos: [Producto]
        obtenerProducto(id: ID!): Producto
    } 
    input autenticarInput {
        email: String
        password: String
    }   
    
    type Mutation {
        #Usuarios
        nuevoUsuario(input: inputUsuario): Usuario
        autenticarUsuario(token: autenticarInput): Token
        
        #Productos 
        nuevoProducto(input: inputProducto): Producto
        actualizarProducto(id: ID!, input: inputActualizarProducto): Producto
        eliminarProducto(id: ID!): String

        
        
    }
   
     
    
    
`;

module.exports = typeDefs;