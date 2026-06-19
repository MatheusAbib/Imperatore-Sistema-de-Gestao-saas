const express = require('express');
const autenticar = require('../middlewares/auth');
const { listarLogs, limparLogsAntigos } = require('../controllers/logController');

const router = express.Router();

router.use(autenticar);

router.get('/', listarLogs);
router.delete('/limpar', limparLogsAntigos);

module.exports = router;