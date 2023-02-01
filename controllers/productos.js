const {
    response
} = require("express");
const {
    Producto
} = require("../models");


// Obtener productos - total - paginado - populate
const obtenerProductos = async (req, res = response) => {

    const {
        limite = 10, desde = 0
    } = req.query;

    const query = {
        state: true
    };

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto
        .find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .limit(Number(limite))
        .skip(Number(desde))
    ]);


    res.json({
        total,
        productos
    });

}

// Obtener producto por ID
const obtenerProducto = async (req, res = response) => {

    const {
        id
    } = req.params;

    const producto = await Producto.findById(id)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre');

    res.json(producto);

}

// Crear producto
const crearProducto = async (req, res = response) => {

    const { ...data } = req.body;

    data.nombre = data.nombre.toUpperCase();

    try {

        const productoDb = await Producto.findOne({
            nombre: data.nombre
        });

        // Validar que el producto esté en la BD
        if (productoDb) {
            return res.status(401).json({
                msg: `El producto ${data.nombre} ya está agregado`,
            });
        }

        const nuevoProducto = {
            ...data,
            usuario: req.usuario._id,
        }

        // Modelo con los datos a guardar
        const producto = new Producto(nuevoProducto);

        // Guardar producto
        await producto.save();

        res.status(201).json(producto);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'algo anda mal, hable con el administrador',
        });
    }
}

// Actualizar producto
const actualizarProducto = async (req, res = response) => {

    const {
        id
    } = req.params;

    const {
        state,
        usuario,
        categoria,
        ...data
    } = req.body;

    // Guardar nombre del producto en mayúsculas
    data.nombre = data.nombre.toUpperCase();

    const productoDB = await Producto.findById(id);

    if (!productoDB.state) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre} ya está eliminada`,
        });
    }

    // producto actualizado
    const producto = await Producto.findByIdAndUpdate(id, data, {
            new: true
        })
        // traer ID y nombre de usuario que actualizó el producto
        .populate('usuario', 'nombre');

    res.json(producto);

}

// Eliminar producto (status : false)
const eliminarProducto = async (req, res = response) => {

    const {
        id
    } = req.params;

    const producto = await Producto.findById(id);

    if (!producto.state) {
        return res.status(401).json({
            msg: `El producto ${producto.nombre} ya está eliminado`,
        });
    }

    const productoEliminado = await Producto.findByIdAndUpdate(id, {
            state: false
        }, {
            new: true
        })
        .populate('usuario', 'nombre');

    res.json(productoEliminado);

}


module.exports = {
    crearProducto,
    obtenerProducto,
    obtenerProductos,
    actualizarProducto,
    eliminarProducto,
}