const validarArchivos = (req, res, next) => {
    // propiedad donde vienen los objetos files que se suban
    // console.log(req.files);

    // Si no vienen archivos (files) en la request
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        return res.status(401).json({
            msg: 'No hay archivos que subir',
        });
    }

    next();
}

module.exports = {
    validarArchivos,
}