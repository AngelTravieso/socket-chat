const { Usuario, Categoria, Producto } = require('../models');
const Role = require('../models/rol');

// Validar roles contra la BD

/*
    1. custom() para pasar funcion personalizada y validar un parametro de la request
    2. rol = '' : es el valor 'rol' que me llega en la peticion (request), si no llega nada que sea String vacio
    3. busco en mi colecciòn de 'Roles' y verifico que el rol que llega en la peticiòn este guardado en mi colecciòn de 'Roles'
    4. muestro error personalizado (no revienta la app) 
*/

// Validar que el rol este en la BD
const esRoleValido = async (rol = '') => {
    const existeRol = await Role.findOne({ rol });

    if (!existeRol) {
        // lanzar error personalizado (no revienta la app)
        throw new Error(`El rol ${rol} no está registrado en la BD`);
    }

}

// Validar si el email existe en la colección (no debe repetirse)
const emailExiste = async (email = '') => {
    // Verificar si el correo existe
    const existeEmail = await Usuario.findOne({ email });

    // Si el correo existe
    if (existeEmail) {
        throw new Error(`El correo, ${email} ya está registrado`);
    }
}

// Verificar si el ID dado para actualizar existe en la BD
const existeUsuarioPorId = async (id) => {
    // Verificar si usuario existe
    const existeUsuario = await Usuario.findById(id);

    if (!existeUsuario) {
        throw new Error(`El id ${id} no existe`);
    }
}

// Verificar si el ID para traer la categoria existe en la BD
const existeCategoriaId = async (id) => {

    const existeCategoria = await Categoria.findById(id);

    if (!existeCategoria) {
        throw new Error(`El id ${id} no existe`);
    }

}

// Verificar si el ID para traer la categoria existe en la BD
const existeProductoId = async (id) => {

    const existeProducto = await Producto.findById(id);

    if (!existeProducto) {
        throw new Error(`El id ${id} no existe`);
    }

}

// Validar colecciones permitidas
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La colección ${coleccion} no es permitida, debe ser ${colecciones}`);
    }

    return true;

}


module.exports = {
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaId,
    existeProductoId,
    coleccionesPermitidas,
}