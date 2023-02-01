const auth = require('./auth');
const buscar = require('./buscar');
const categorias = require('./buscar');
const productos = require('./productos');
const usuarios = require('./usuarios');
const uploads = require('./uploads');

module.exports = {
    ...auth,
    ...buscar,
    ...categorias,
    ...productos,
    ...usuarios,
    ...uploads,
}