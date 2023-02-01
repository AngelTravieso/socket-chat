const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

// Validar integridad del JWT
const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición',
        });
    }

    try {

        // Verificar jwt (si es valido o no)
        const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        // Leer el usuario al que corresponde uid
        const usuario = await Usuario.findById(uid);

        // Si el usuario no existe
        if (!usuario) {
            return res.status(400).json({
                msg: 'Token no válido - usuario no existe en la BD'
            });
        }

        // Verificar si el uid tiene state true
        if (!usuario.state) {
            return res.status(401).json({
                msg: 'Token no válido - usuario false',
            });
        }

        // { uid: '63cc4ac43624c22f8916f723', iat: 1674403982, exp: 1674418382 }
        // console.log(payload);

        // crear nueva propiedad en el objeto req
        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no válido',
        });
    }

}

module.exports = {
    validarJWT,
}