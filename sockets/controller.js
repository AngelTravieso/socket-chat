const { Socket } = require("socket.io")

// No se debe hacer el new Socket, es para tener el tipado
const socketController = (socket = new Socket) => {

    console.log('cliente conectado', socket.id);

}

module.exports = {
    socketController,
}