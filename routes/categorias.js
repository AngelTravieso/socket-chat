const {
    Router
} = require('express');
const {
    check
} = require('express-validator');
const {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    eliminarCategoria
} = require('../controllers/categorias');
const {
    existeCategoriaId
} = require('../helpers/db-validators');

const router = Router();

const {
    validarJWT,
    validarCampos,
    esAdminRole
} = require('../middlewares');

/**
 * {{url}}/api/categorias
 */

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por ID - publico
router.get('/:id', [
    check('id', 'No es una ID de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaId),
    validarCampos,
], obtenerCategoria);

// Crear una nueva categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], crearCategoria);

// Actualizar un registro por este ID
router.put('/:id', [
    validarJWT,
    check('id', 'No es una ID de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos,
], actualizarCategoria);

// Borrar una categoria - ADMIN_ROLE
router.delete('/:id', [
    validarJWT,
    check('id', 'No es una ID de mongo válido').isMongoId(),
    check('id').custom(existeCategoriaId),
    esAdminRole,
    validarCampos,
], 
eliminarCategoria);


module.exports = router;