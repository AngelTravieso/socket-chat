const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers");
const { ChatMensajes } = require('../models');

// Se ejecuta solo una vez cuando el servidor se levanta
const chatMensajes = new ChatMensajes();

// No se debe hacer el new Socket, es para tener el tipado
// io es todo el servidor de sockets (ahí estan todos, incluyendo la persona que se conecta)
const socketController = async (socket = new Socket, io) => {
    // Recibir token del front
    const token = socket.handshake.headers['x-token'];

    const usuario = await comprobarJWT(token);

    // Si no hay usuario o está deshabilitado
    if (!usuario) {
        // Desconectar el socket
        return socket.disconnect();
    }


    // Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuariosArr); // emitir mensajes a TODOS

    // Enviar solo a esa persona (la que se conecta) la lista de los ultimos 10 mensajes
    socket.emit('recibir-mensajes', chatMensajes.ultimos10);

    // Conectarlo a una sala especial (privado)
    socket.join(usuario.id); // global, socket.id, usuario.id


    // Limpiar cuando alguien se desconecta
    socket.on('disconnect', () => {
        // Eliminar usuario
        chatMensajes.desconectarUsuario(usuario.id);

        // Reportar nuevamente los usuarios activos
        io.emit('usuarios-activos', chatMensajes.usuariosArr);
    });

    // Escuchar mensajes enviados
    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if (uid) {
            // Mensaje privado
            socket.to(uid).emit('mensaje-privado', { de: usuario.nombre, mensaje });
        } else {
            // Enviar mensaje a los usuario conectados
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje);
            io.emit('recibir-mensajes', chatMensajes.ultimos10);

        }

    });

}

module.exports = {
    socketController,
}