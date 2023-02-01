const jwt = require('jsonwebtoken');

const { Usuario } = require('../models');

const generarJWT = (uid = '') => {
    return new Promise((resolve, reject) => {

        // Lo que guardará mi JWT
        const payload = { uid };

        // Firmar nuevo token
        jwt.sign(payload, process.env.SECRETORPUBLICKEY, {
            expiresIn: '4h', // tiempo de expiracion
        }, (err, token) => {
            if (err) {
                console.log(error);
                reject('No se pudo generar el token');
            } else {
                resolve(token);
            }
        });


    });
}


// Validar token enviado desde el front
const comprobarJWT = async ( token = '') => {
    try {
        if(token.length < 10) {
            return null;
        }

        // Verificar token valido
        const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

        const usuario = await Usuario.findById( uid );

        // Validar que exista el usuario y este habilitado (state: true)
        if(usuario && usuario.state) {
            return usuario;
        } else {
            return null;
        }


    } catch (error) {
        return null;
    }
}

module.exports = {
    generarJWT,
    comprobarJWT,
}