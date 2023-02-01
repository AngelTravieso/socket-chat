const { Usuario, Categoria, Producto } = require('../models');
const { ObjectId } = require('mongoose').Types;

// Buscar usuarios
const buscarUsuarios = async( termino = '', res = response ) => {

    // Validar si el termino es un ID de mongo válido
    const esMongoID = ObjectId.isValid( termino );

    // Si es un ID válido
    if(esMongoID) {
        const usuario = await Usuario.findById( termino );
        return res.json({
            // Si el usuario existe regreso un arreglo con el usuario, si no un array vacio
            results: ( usuario ) ? [ usuario ] : [],
        });
    }

    // buscar el termino haciendolo insensible a mayusculas o minusculas
    const regexp = new RegExp(termino, 'i');

    // Búsqueda por nombre o correo
    const [ total, usuarios ] = await Promise.all([
        Usuario.count({
            // or de mongo db, [ querys ]
            $or: [{nombre: regexp }, { email: regexp}],
            // que el usuario este activo
            $and: [{  state: true }],
        }),
        // El find regresa un arreglo vacio si no consigue resultados
        Usuario.find({
            // or de mongo db, [ querys ]
            $or: [{nombre: regexp }, { email: regexp}],
            // que el usuario este activo
            $and: [{  state: true }],
        }),
    ]);
    
    return res.json({
        total,
        results: usuarios,
    });

}

// Buscar Categoría
const buscarCategorias = async( termino = '', res = response ) => {
    
    // Validar si el termino es un ID de mongo válido
    const esMongoID = ObjectId.isValid( termino );

    // Si es un ID válido
    if(esMongoID) {
        // traer categoria con status: true
        const categoria = await Categoria.findById( termino ).and({ state: true }).populate('usuario', 'nombre');
        return res.json({
            // Si el categoria existe regreso un arreglo con el categoria, si no un array vacio
            results: ( categoria ) ? [ categoria ] : [],
        });
    }

    // buscar el termino haciendolo insensible a mayusculas o minusculas
    const regexp = new RegExp(termino, 'i');

    // Búsqueda por nombre (solo las que tengan status: true)
    const categorias = await Categoria.find({ nombre: regexp }).and( { state: true }).populate('usuario', 'nombre');

    return res.json({
        categorias,
    });

}

// Buscar Producto
const buscarProductos = async( termino = '', res = response ) => {
    
    // Validar si el termino es un ID de mongo válido
    const esMongoID = ObjectId.isValid( termino );

    // Si es un ID válido
    if(esMongoID) {
        // traer producto con status: true
        const producto = await Producto.findById( termino ).and({ state: true }).populate('categoria', 'nombre');
        return res.json({
            // Si el producto existe regreso un arreglo con el categoria, si no un array vacio
            results: ( producto ) ? [ producto ] : [],
        });
    }

    // buscar el termino haciendolo insensible a mayusculas o minusculas
    const regexp = new RegExp(termino, 'i');

    // Búsqueda por nombre (solo las que tengan status: true)
    const productos = await Producto.find({ nombre: regexp }).and( { state: true }).populate('categoria', 'nombre');;

    return res.json({
        productos,
    });

}

module.exports = {
    buscarUsuarios,
    buscarCategorias,
    buscarProductos,
}