const Categoria = require('./categoria');
const Producto = require('./producto');
const Rol = require('./rol');
const Server = require('./server');
const Usuario = require('./usuario');
const ChatMensajes = require('./chat-mensajes');

// Otra manera de hacerlo
// module.exports = require('./categoria');
// module.exports = require('./rol');
// module.exports = require('./server');
// module.exports = require('./usuario');

module.exports = {
    Categoria,
    Producto,
    Rol,
    Server,
    Usuario,
    ChatMensajes,
}
