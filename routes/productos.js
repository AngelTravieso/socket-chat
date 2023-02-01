const {
    Router
} = require('express');
const {
    check
} = require('express-validator');

const {
    validarCampos,
    validarJWT,
    esAdminRole
} = require('../middlewares');

const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    eliminarProducto,
    actualizarProducto
} = require('../controllers/productos');

const {
    existeProductoId,
    existeCategoriaId
} = require('../helpers/db-validators');

const router = Router();


// Obtener todos los productos - publico
router.get('/', obtenerProductos);

// Obtener producto por ID - publico
router.get('/:id', [
    check('id', 'No es un ID de mongo válido').isMongoId(),
    check('id').custom(existeProductoId),
    validarCampos
], obtenerProducto);

// Crear producto
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre del producto es obligatorio').notEmpty(),
    check('state', 'El state es obligatorio').notEmpty(),
    check('categoria', 'No es un ID de mongo válido').isMongoId(),
    check('categoria').custom(existeCategoriaId),
    validarCampos,
], crearProducto);

// Actualizar producto - privado - cualquiera con token válido
router.put('/:id', [
    validarJWT,
    check('id', 'No es un ID de mongo válido').isMongoId(),
    check('id').custom(existeProductoId),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    validarCampos,
], actualizarProducto);

// Eliminiar producto - ADMIN_ROLE
router.delete('/:id',[
    validarJWT,
    check('id', 'No es un ID de mongo válido').isMongoId(),
    check('id').custom(existeProductoId),
    esAdminRole,
    validarCampos,
] ,eliminarProducto);

module.exports = router;