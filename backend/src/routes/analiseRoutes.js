const express = require('express');
const autenticar = require('../middlewares/auth');
const { getAnaliseVendas } = require('../controllers/analiseController');

const router = express.Router();

router.use(autenticar);

router.get('/vendas', getAnaliseVendas);

module.exports = router;