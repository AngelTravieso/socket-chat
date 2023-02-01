const {
    response
} = require("express");

const {
    Categoria
} = require("../models");

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req, res = response) => {

    const {
        limite = 10, desde = 0
    } = req.query;

    // query, traer categorias con state: true
    const query = {
        state: true
    };

    // Buscar categorias con parametros
    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(),
        Categoria.find(query)
        /*
            mantener referencia de la colección de usuario
            datos del usuario que creo la categoria
            mostrar solo el nombre del usuario
        */
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);


    res.json({
        total,
        categorias,
    });

}

// obtenerCategoria - populate {}
const obtenerCategoria = async (req, res = response) => {

    const {
        id
    } = req.params;

    const categoria = await Categoria.findById(id)
        .populate('usuario', 'nombre');

    res.json(categoria);

}

// Crear categoria
const crearCategoria = async (req, res = response) => {

    // capitalizar nombre de categoria
    const nombre = req.body.nombre.toUpperCase();

    try {
        const categoriaDB = await Categoria.findOne({
            nombre
        });

        // Si la categoria ya esta creada
        if (categoriaDB) {
            res.status(400).json({
                msg: `La categoria ${nombre} ya existe`,
            });
        }

        // Generar la data a guardar
        const data = {
            nombre,
            // Id del usuario en mongoDB
            usuario: req.usuario._id,
        }

        // Crear modelo con datos
        const categoria = new Categoria(data);

        // Guardar en DB
        await categoria.save()

        res.status(201).json(categoria);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'algo anda mal, hable con el administrador',
        });
    }

}

// actualizar categoria (solo recibe el nombre)
const actualizarCategoria = async (req, res) => {
    // ID de la categoria a actualizar
    const {
        id
    } = req.params;

    // Extraer lo que no necesito (state y usuario)
    const {
        state,
        usuario,
        ...data
    } = req.body;

    // Nombre nuevo de la categoria (en mayusculas)
    data.nombre = data.nombre.toUpperCase();

    // ID del usuario que hizo la modificación
    data.usuario = req.usuario._id;

    const categoriaDB = await Categoria.findById(id);

    // Si la categoria tiene status: false
    if (!categoriaDB.state) {
        res.status(401).json({
            msg: `La categoria ${categoriaDB.nombre} ya está eliminada`,
        });
    }

    // Buscar categoria por ID y cambiar nombre
    // new: true para enviar siempre el nuevo archivo
    const categoria = await Categoria.findByIdAndUpdate(id, data, {
        new: true
    });

    res.json(categoria);

}

// eliminar categoria - state: false
const eliminarCategoria = async (req, res = response) => {

    const { id } = req.params;

    const categoria = await Categoria.findById( id );

    if(!categoria.state) {
        return res.status(401).json({
            msg: `La categoría ${categoria.nombre} ya está eliminada`,
        });
    }

    // Buscar ID de la categoria y cambiar status: false
    const usuarioEliminado = await Categoria.findByIdAndUpdate(id, {
        state: false
    }, {
        new: true
    }).populate('usuario', 'nombre');

    res.json(usuarioEliminado);
}

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria,
}