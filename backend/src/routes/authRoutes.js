const express = require('express');
const { registrar, login, criarFuncionario, listarUsuarios, atualizarPerfilFuncionario, deletarUsuario, atualizarPerfilUsuario, alterarSenha } = require('../controllers/authController');
const autenticar = require('../middlewares/auth');

const router = express.Router();

router.post('/registrar', registrar);
router.post('/login', login);
router.post('/funcionarios', autenticar, criarFuncionario);
router.get('/usuarios', autenticar, listarUsuarios);
router.put('/usuarios/:id/perfil', autenticar, atualizarPerfilFuncionario);
router.delete('/usuarios/:id', autenticar, deletarUsuario);
router.put('/perfil', autenticar, atualizarPerfilUsuario);
router.put('/senha', autenticar, alterarSenha);

module.exports = router;