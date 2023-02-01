const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");

// No se debe hacer el new Socket, es para tener el tipado
const socketController = async (socket = new Socket) => {
    // Recibir token del front
    const token = socket.handshake.headers['x-token'];

    const usuario = await comprobarJWT(token);
    
    // Si no hay usuario o está deshabilitado
    if(!usuario) {
        // Desconectar el socket
        return socket.disconnect();
    }

    console.log(`Se conectó ${usuario.nombre}`);

}

module.exports = {
    socketController,
}