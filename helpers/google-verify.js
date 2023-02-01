const { OAuth2Client } = require('google-auth-library');


const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleVerify = async (idToken = '') => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    // desestructurar lo que necesito
    // cambiar el nombre en la desestructuracion
    // porque las propiedades de mi modelo estan así
    const {
        name: nombre,
        email,
        picture: img,
    } = ticket.getPayload();

    return {
        nombre,
        email,
        img,
    }

}

module.exports = {
    googleVerify,
}