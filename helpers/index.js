const buscador = require('./buscador');
const colecciones = require('./colecciones');
const dbValidators = require('./db-validators');
const generarJWT = require('./generarJWT');
const googleVerify = require('./google-verify');
const hashField = require('./hash-field');
const subirArchivo = require('./subir-archivo');

module.exports = {
    ...buscador,
    ...colecciones,
    ...dbValidators,
    ...generarJWT,
    ...googleVerify,
    ...hashField,
    ...subirArchivo,
}