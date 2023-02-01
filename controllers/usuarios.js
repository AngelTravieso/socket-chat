// Para obtener el tipado
const {
    response,
    request
} = require('express');

const bcriptjs = require('bcryptjs');

// en mayuscula para crear nuevas instancias del modelo
const Usuario = require('../models/usuario');

const { hashField } = require('../helpers/hash-field');
const usuario = require('../models/usuario');


/*
    QueryParams (GET): 
        URL?variable=valor (http://localhost/api/usuarios?nombre=angel)
        req.query

    Body (POST)
        req.body

    BodyParams (PUT):
        URL/id (http://localhost/api/usuarios/12312323)
        req.params
*/

// Obtener usuario
const usuariosGet = async (req = request, res = response) => {

    // const params = req.query;

    // si no viene por defecto es 5

    /*
    limite: cantidad de registros que quiero traer
    desde: a partir de donde, de que registro quiero traer
    */
    const { limite = 5, desde = 0 } = req.query;

    const query = { state: true };

    // Lo que necesito
    // const {
    //     q,
    //     nombre = 'No name',
    //     apikey,
    //     page = 1,
    //     limit
    // } = req.query;

    // Promise.all Efectua las promesas de manera simultanea
    // es recomendado y más rápido
    // desestructurar arreglo de promesas
    // la 1era corresponde a la primera promesa y así sucesivamente
    const [total, usuarios] = await Promise.all([
        // traer todos los usuarios (datos) de la BD con state true (activos)
        // obtener el total de registros en la bd
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            // limitar el numero de registros devueltos
            // los queryParams vienen en String, se debe castear
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    })
}

// Crear usuario
const usuariosPost = async (req, res = response) => {
    // obtener body completo
    // const body = req.body;

    // desestructurar parametros
    const {
        nombre,
        email,
        password,
        rol
    } = req.body;

    /*
    lo que no esté incluido en mi modelo y venga en la peticion
    mongoose lo ignorará y no lo insertara en la coleccion de mongo
    */

    // instanciar modelo
    const usuario = new Usuario({
        nombre,
        email,
        password,
        rol
    });

    // Helper para encriptar String dado (en este caso password)
    usuario.password = hashField(password);

    // Guardar en BD
    await usuario.save();

    // cambiar codigo HTTP de la respuesta
    // res.status(201).json({
    //     msg: 'post API - usuariosPost',
    // });

    res.json({
        usuario
    });
}

// Actualizar Usuario
const usuariosPut = async (req = request, res = response) => {

    // const id = req.params.id; (http://localhost:8082/api/usuarios/10)

    // Extraer lo que necesito
    const { id } = req.params;

    // extraer lo que no necesito manipular
    const { _id, password, google, email, ...resto } = req.body;

    // Si viene el password es porque quiere actualizarla
    if (password) {
        resto.password = hashField(password);
    }

    // se actualiza con los datos que no desestructure
    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

// Actualizar (el patch es parcial)
const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch',
    });
}

// Eliminar Usuario
const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    // borrar documento fisicamente (no recomendado)
    // const usuario = await Usuario.findByIdAndDelete(id);

    // deshabilitar usuario (status: true)
    /*
    no se recomienda eliminar datos de la bd porque puede
    llegar a afectar la integridad de la bd, es mejor
    manejar status para los registros
    */
    const usuario = await Usuario.findByIdAndUpdate(id, {
        state: false
    });

    // obtener usuarioAutenticado con el jwt
    // const usuarioAutenticado = req.usuario;

    // retornar ID de usuario eliminado y autenticado
    // res.json({ usuario, usuarioAutenticado });

    res.json(usuario);

}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};