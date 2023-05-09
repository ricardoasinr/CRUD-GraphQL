const Usuario = require('../models/Usuario')

const Producto = require('../models/producto')
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
//Aquí se importan las variables
require('dotenv').config({path:'variables.env'});

//Aquí se crea la función que nos permite crear el token
const crearToken = (usuario, firma, expiresIn) => {
    const {id, email, nombre, apellido} = usuario;
    return jwt.sign({id, email, nombre, apellido}, firma, {expiresIn})
}


const resolvers = {
    Query: {
        obtenerUsuario: async (_, {token}) => {
            console.log("Obteniendo usuario")
            const usuarioId = await jwt.verify(token, process.env.FIRMA)
            console.log(usuarioId)

            return usuarioId
        },
        obtenerProductos: async () => {
            try {
                const productos = await Producto.find({});
                return productos;
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProducto: async (_, { id }) => {
            // Revisar si el producto existe
            const producto = await Producto.findById(id);

            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            return producto;
        },

    },
    Mutation: {
        nuevoUsuario: async (_,{ input } ) => {
            console.log(input);
            const { email, password } = input;
            //Revisar si el Usuario está registrado
            const existeUsuario = await  Usuario.findOne({email});
            //console.log(`existeUsuario: ${existeUsuario}`);
            if(existeUsuario){
                throw new Error(`El usuario con ese mail ${email} ya fue registrado`)
            }
            //Hash-ear el password
            const salt = await bcryptjs.genSaltSync(10);
            input.password = await bcryptjs.hash(password, salt);

            //Guardarlo en la Base de Datos
            try {
                const usuario = new Usuario(input);
                console.log(usuario);
                await usuario.save();
                return usuario;
            } catch (error){
                console.log(error);
            }
            return "Creando usuario....";
        },
        autenticarUsuario: async (_,{ token }) => {
            console.log(token);
            const {email, password} = token;
            //Verificar si el Usuario existe
            //Revisar si el Usuario está registrado

            const existeUsuario = await  Usuario.findOne({email});
            //console.log(`existeUsuario: ${existeUsuario}`);
            if(!existeUsuario){
                throw new Error(`El usuario con ese mail ${email} no existe`)
            }
            //Revisar si el password es correcto

            const passwordCorrecto = await bcryptjs.compare(password, existeUsuario.password);
            if(!passwordCorrecto){
                throw new Error(`El password es incorrecto ${password}`)
            }

            //Crear token


            return  {
                token: crearToken(existeUsuario, process.env.FIRMA, "24000000000")
            }

        },
        nuevoProducto: async (_,{input }) => {
            try{
                const producto = await new Producto(input);
                console.log(producto)
                //Se va a retornar lo que se guardó
                const resultado = await producto.save()

                return resultado
            }catch (error){
                console.log(error);
            }
        },

        actualizarProducto: async (_, { id, input }) => {
            // Revisar si el producto existe
            let producto = await Producto.findById(id);

            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // Guardar el producto en la Base de Datos
            producto = await Producto.findOneAndUpdate({ _id: id }, input, { new: true });

            return producto;
        },

        eliminarProducto: async (_, { id }) => {
            // Revisar si el producto existe
            let producto = await Producto.findById(id);

            if (!producto) {
                throw new Error('Producto no encontrado');
            }

            // Eliminar el producto de la Base de Datos
            await Producto.findOneAndDelete({ _id: id });

            return 'Producto eliminado correctamente';
        }



    }



}

module.exports = resolvers;