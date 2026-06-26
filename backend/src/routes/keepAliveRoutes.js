const express = require('express');
const router = express.Router();
const { keepAlive } = require('../controllers/keepAliveController');

router.get('/keep-alive', keepAlive);

module.exports = router;