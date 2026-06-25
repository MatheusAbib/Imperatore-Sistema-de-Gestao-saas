const express = require('express');
const { limparComandas } = require('../controllers/cleanupController');

const router = express.Router();

router.delete('/cleanup/comandas', limparComandas);

module.exports = router;