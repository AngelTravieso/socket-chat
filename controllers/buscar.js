const {
    response
} = require("express");

const {
    colecciones,
    buscarCategorias,
    buscarProductos,
    buscarUsuarios
} = require("../helpers");


// Buscar en las colecciones por término
const buscar = (req, res = response) => {

    // Obtener parametros de busqueda
    const {
        coleccion,
        termino
    } = req.params;

    // Validar la coleccion por la que se busca
    if (!colecciones.includes(coleccion)) {
        return res.status(400).json({
            msg: `Las coleciones permitidas son ${coleccionesPermitidas}`,
        });
    }

    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvidó haceer esta búsqueda',
            });
    }

}


module.exports = {
    buscar,
}