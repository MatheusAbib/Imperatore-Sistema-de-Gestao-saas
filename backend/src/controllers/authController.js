const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { gerarToken } = require('../config/jwt');

async function registrar(req, res) {
    const { nome, email, senha, perfil } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Nome, email e senha sao obrigatorios' });
    }

    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
        return res.status(409).json({ mensagem: 'Email ja cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuarioId = await Usuario.criar({ nome, email, senha: senhaHash, perfil: perfil || 'atendente', estabelecimento_id: null });
    const token = gerarToken(usuarioId, null);

    const usuario = await Usuario.buscarPorId(usuarioId);

    res.status(201).json({ token, usuario });
}

async function login(req, res) {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ mensagem: 'Email e senha sao obrigatorios' });
    }

    const usuario = await Usuario.buscarPorEmail(email);
    if (!usuario) {
        return res.status(401).json({ mensagem: 'Email ou senha invalidos' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Email ou senha invalidos' });
    }

    const token = gerarToken(usuario.id, usuario.estabelecimento_id);

    res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, estabelecimento_id: usuario.estabelecimento_id } });
}

async function criarFuncionario(req, res) {
    const { nome, email, senha, perfil } = req.body;
    const donoId = req.usuarioId;

    const dono = await Usuario.buscarPorId(donoId);
    if (dono.perfil !== 'dono') {
        return res.status(403).json({ mensagem: 'Apenas dono pode criar funcionarios' });
    }

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'Nome, email e senha sao obrigatorios' });
    }

    const usuarioExistente = await Usuario.buscarPorEmail(email);
    if (usuarioExistente) {
        return res.status(409).json({ mensagem: 'Email ja cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const usuarioId = await Usuario.criar({ 
        nome, 
        email, 
        senha: senhaHash, 
        perfil: perfil || 'atendente', 
        estabelecimento_id: dono.estabelecimento_id 
    });

    const usuario = await Usuario.buscarPorId(usuarioId);
    res.status(201).json({ mensagem: 'Funcionario criado com sucesso', usuario });
}

async function listarUsuarios(req, res) {
    const usuario_id = req.usuarioId;
    const usuario = await Usuario.buscarPorId(usuario_id);
    
    if (usuario.perfil !== 'dono') {
        return res.status(403).json({ mensagem: 'Acesso negado. Apenas dono pode listar usuarios' });
    }

    const usuarios = await Usuario.listarPorEstabelecimento(usuario.estabelecimento_id, usuario_id);
    res.json(usuarios);
}

async function atualizarPerfilFuncionario(req, res) {
    const { id } = req.params;
    const { perfil } = req.body;
    const usuario_id = req.usuarioId;
    
    const usuario = await Usuario.buscarPorId(usuario_id);
    if (usuario.perfil !== 'dono') {
        return res.status(403).json({ mensagem: 'Acesso negado. Apenas dono pode alterar perfis' });
    }

    await Usuario.atualizarPerfil(id, perfil);
    res.json({ mensagem: 'Perfil atualizado com sucesso' });
}

async function deletarUsuario(req, res) {
    const { id } = req.params;
    const usuario_id = req.usuarioId;
    
    const usuario = await Usuario.buscarPorId(usuario_id);
    if (usuario.perfil !== 'dono') {
        return res.status(403).json({ mensagem: 'Acesso negado. Apenas dono pode deletar usuarios' });
    }

    await Usuario.deletar(id);
    res.json({ mensagem: 'Usuario deletado com sucesso' });
}

async function atualizarPerfilUsuario(req, res) {
    const { nome, email } = req.body;
    const usuario_id = req.usuarioId;
    const db = require('../config/database');
    
    const [emailExistente] = await db.execute('SELECT id FROM usuarios WHERE email = ? AND id != ?', [email, usuario_id]);
    if (emailExistente.length > 0) {
        return res.status(409).json({ mensagem: 'Email ja cadastrado por outro usuario' });
    }

    await db.execute('UPDATE usuarios SET nome = ?, email = ? WHERE id = ?', [nome, email, usuario_id]);
    
    res.json({ mensagem: 'Perfil atualizado com sucesso' });
}

async function alterarSenha(req, res) {
    const { senha_atual, nova_senha } = req.body;
    const usuario_id = req.usuarioId;
    const db = require('../config/database');

    const [rows] = await db.execute('SELECT senha FROM usuarios WHERE id = ?', [usuario_id]);
    const usuario = rows[0];

    const senhaValida = await bcrypt.compare(senha_atual, usuario.senha);
    if (!senhaValida) {
        return res.status(401).json({ mensagem: 'Senha atual incorreta' });
    }

    const novaSenhaHash = await bcrypt.hash(nova_senha, 10);
    await db.execute('UPDATE usuarios SET senha = ? WHERE id = ?', [novaSenhaHash, usuario_id]);
    
    res.json({ mensagem: 'Senha alterada com sucesso' });
}

module.exports = { 
    registrar, 
    login, 
    criarFuncionario, 
    listarUsuarios, 
    atualizarPerfilFuncionario, 
    deletarUsuario,
    atualizarPerfilUsuario,
    alterarSenha
};