const { response } = require("express");
const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
// Configurar cuenta cloudinary
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

// Cargar archivos
const cargarArchivo = async (req, res = response) => {

    try {
        // Imagenes
        // const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');

        const nombre = await subirArchivo(req.files, undefined, 'imgs');

        res.json({
            nombre,
        });
    } catch (msg) {
        res.status(400).json({
            msg
        });
    }

}

// Actualiar img (local)
const actualizarImagen = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            // Verificar si la coleccion tiene el ID que me llega
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                });
            }

            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // Limpiar imagenes previas (borrar)

    // Si el modelo tiene propiedad img
    if (modelo.img) {
        // Hay que borrar la imagen del servidor
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        // Si la imagen existe
        if (fs.existsSync(pathImagen)) {
            // Se borra la imagen
            fs.unlinkSync(pathImagen);
        }

    }

    // Subir archivo (img) en carpeta (coleccion)
    const nombre = await subirArchivo(req.files, undefined, coleccion);

    // Agregar la img al modelo
    modelo.img = nombre;

    // Guardar nuevo modelo (puede ser usuario o productos)
    await modelo.save();

    // Retornar modelo
    res.json(modelo);

}

// Actualiar img (Cloudinary)
const actualizarImagenCloudinary = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            // Verificar si la coleccion tiene el ID que me llega
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                });
            }

            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // Limpiar imagenes previas (borrar)

    // Si el modelo tiene propiedad img
    if (modelo.img) {

        const nombreArr = modelo.img.split('/');

        // Obtener nombre de la img
        nombre = nombreArr[nombreArr.length - 1];

        // Obtener id publico de la img
        const [public_id] = nombre.split('.'); // split por el . de la url de la img

        // Eliminar imagen
        cloudinary.uploader.destroy(public_id);
    }

    // Obtener path temporal de la img
    const { tempFilePath } = req.files.archivo;

    // Subir img a cloudinary
    const { secure_url } = await cloudinary.uploader.upload(tempFilePath); // obtener solo el secure_url

    // Agregar la img al modelo
    modelo.img = secure_url;

    // Guardar nuevo modelo (puede ser usuario o productos)
    await modelo.save();

    // Retornar modelo
    res.json(modelo);

}


// Mostrar imagen (devolver al front)
const mostrarImagen = async (req, res = response) => {

    const { coleccion, id } = req.params;

    let modelo;

    switch (coleccion) {
        case 'usuarios':

            // Verificar si la coleccion tiene el ID que me llega
            modelo = await Usuario.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${id}`,
                });
            }

            break;
        case 'productos':
            modelo = await Producto.findById(id);

            if (!modelo) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${id}`,
                });
            }

            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó validar esto'
            });
    }

    // Limpiar imagenes previas (borrar)

    // Si el modelo tiene propiedad img
    if (modelo.img) {
        // Armar ruta de la imagen
        const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

        // Si la imagen existe
        if (fs.existsSync(pathImagen)) {
            // Enviar img al front
            return res.sendFile(pathImagen);
        }

    }

    // Devolver img default (placeholder) si no hay modelo con img
    const placeholderImg = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(placeholderImg);
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    actualizarImagenCloudinary,
    mostrarImagen,
}