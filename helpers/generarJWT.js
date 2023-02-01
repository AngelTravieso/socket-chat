const jwt = require('jsonwebtoken');

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

module.exports = {
    generarJWT,
}