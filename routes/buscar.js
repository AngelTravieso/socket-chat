const { Router } = require('express');

const { buscar } = require('../controllers/buscar');

const router = Router();

// Buscar
router.get('/:coleccion/:termino', buscar);


module.exports = router;