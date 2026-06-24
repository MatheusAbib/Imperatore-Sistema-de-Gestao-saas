import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiEdit2, FiServer, FiSearch, FiX, FiAlertCircle, FiUsers, FiUser, FiMail, FiLock, FiInfo, FiMapPin, FiPhone, FiCalendar } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Estabelecimentos() {
    const [estabelecimentos, setEstabelecimentos] = useState([]);
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalEdicao, setModalEdicao] = useState(false);
    const [nome, setNome] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [plano, setPlano] = useState('gratis');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [telefone, setTelefone] = useState('');
    const [cpfDono, setCpfDono] = useState('');
    const [nomeDono, setNomeDono] = useState('');
    const [dataAbertura, setDataAbertura] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [cep, setCep] = useState('');
    const [estado, setEstado] = useState('');
    const [editandoId, setEditandoId] = useState(null);
    const [modalConfirmacao, setModalConfirmacao] = useState(null);
    const [busca, setBusca] = useState('');
    const [modalUsuarios, setModalUsuarios] = useState(null);
    const [mostrarFormUsuario, setMostrarFormUsuario] = useState(false);
    const [nomeUsuario, setNomeUsuario] = useState('');
    const [emailUsuario, setEmailUsuario] = useState('');
    const [senhaUsuario, setSenhaUsuario] = useState('');
    const [perfilUsuario, setPerfilUsuario] = useState('atendente');
    const [editandoUsuarioId, setEditandoUsuarioId] = useState(null);
    const [modalConfirmacaoUsuario, setModalConfirmacaoUsuario] = useState(null);
    const [alterarSenha, setAlterarSenha] = useState(false);
    const [modalDetalhes, setModalDetalhes] = useState(null);

    const estados = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    const perfis = [
        { valor: 'atendente', label: 'Atendente' },
        { valor: 'cozinha', label: 'Cozinha' },
        { valor: 'gerente', label: 'Gerente' },
        { valor: 'dono', label: 'Dono' }
    ];

    useEffect(() => {
        carregarEstabelecimentos();
    }, []);

    const carregarEstabelecimentos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/estabelecimentos');
            setEstabelecimentos(response.data);
        } catch (error) {
            console.error('Erro ao carregar estabelecimentos', error);
            toast.error('Erro ao carregar estabelecimentos');
        } finally {
            setLoading(false);
        }
    };

    const carregarUsuarios = async (estabelecimentoId) => {
        try {
            const response = await api.get(`/admin/estabelecimentos/${estabelecimentoId}/usuarios`);
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao carregar usuarios', error);
            toast.error('Erro ao carregar usuários');
        }
    };

    const abrirModal = (estabelecimento = null) => {
        if (estabelecimento) {
            setEditandoId(estabelecimento.id);
            setNome(estabelecimento.nome);
            setCnpj(estabelecimento.cnpj || '');
            setPlano(estabelecimento.plano || 'gratis');
            setEndereco(estabelecimento.endereco || '');
            setNumero(estabelecimento.numero || '');
            setTelefone(estabelecimento.telefone || '');
            setCpfDono(estabelecimento.cpf_dono || '');
            setNomeDono(estabelecimento.nome_dono || '');
            setDataAbertura(estabelecimento.data_abertura ? estabelecimento.data_abertura.split('T')[0] : '');
            setObservacoes(estabelecimento.observacoes || '');
            setCep(estabelecimento.cep || '');
            setEstado(estabelecimento.estado || '');
        } else {
            setEditandoId(null);
            setNome('');
            setCnpj('');
            setPlano('gratis');
            setEndereco('');
            setNumero('');
            setTelefone('');
            setCpfDono('');
            setNomeDono('');
            setDataAbertura('');
            setObservacoes('');
            setCep('');
            setEstado('');
        }
        setModalEdicao(true);
    };

    const fecharModal = () => {
        setModalEdicao(false);
        setEditandoId(null);
        setNome('');
        setCnpj('');
        setPlano('gratis');
        setEndereco('');
        setNumero('');
        setTelefone('');
        setCpfDono('');
        setNomeDono('');
        setDataAbertura('');
        setObservacoes('');
        setCep('');
        setEstado('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nome) {
            toast.warning('Preencha o nome do estabelecimento');
            return;
        }

        setLoading(true);
        try {
            const dados = {
                nome,
                cnpj: cnpj || null,
                plano,
                endereco: endereco || null,
                numero: numero || null,
                telefone: telefone || null,
                cpf_dono: cpfDono || null,
                nome_dono: nomeDono || null,
                data_abertura: dataAbertura || null,
                observacoes: observacoes || null,
                cep: cep || null,
                estado: estado || null
            };

            if (editandoId) {
                await api.put(`/admin/estabelecimentos/${editandoId}`, dados);
                toast.success('Estabelecimento atualizado com sucesso');
            } else {
                await api.post('/admin/estabelecimentos', dados);
                toast.success('Estabelecimento criado com sucesso');
            }
            fecharModal();
            carregarEstabelecimentos();
        } catch (error) {
            console.error('Erro ao salvar', error);
            toast.error('Erro ao salvar estabelecimento');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const est = estabelecimentos.find(e => e.id === id);
        setModalConfirmacao({ id, nome: est?.nome, cnpj: est?.cnpj || 'Sem CNPJ' });
    };

    const confirmarExclusao = async () => {
        if (!modalConfirmacao) return;
        try {
            await api.delete(`/admin/estabelecimentos/${modalConfirmacao.id}`);
            carregarEstabelecimentos();
            toast.success('Estabelecimento excluído com sucesso');
        } catch (error) {
            console.error('Erro ao deletar', error);
            toast.error('Erro ao excluir estabelecimento');
        } finally {
            setModalConfirmacao(null);
        }
    };

    const formatarCPF = (valor) => {
        const cpf = valor.replace(/\D/g, '');
        if (cpf.length <= 3) return cpf;
        if (cpf.length <= 6) return cpf.replace(/(\d{3})(\d{1,3})/, '$1.$2');
        if (cpf.length <= 9) return cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
        return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    };
    
    const formatarTelefone = (valor) => {
        const tel = valor.replace(/\D/g, '');
        if (tel.length <= 2) return tel;
        if (tel.length <= 6) return tel.replace(/(\d{2})(\d{1,4})/, '($1) $2');
        if (tel.length <= 10) return tel.replace(/(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
        return tel.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    };

    const formatarCNPJ = (valor) => {
        const cnpj = valor.replace(/\D/g, '');
        if (cnpj.length <= 2) return cnpj;
        if (cnpj.length <= 5) return cnpj.replace(/(\d{2})(\d{1,3})/, '$1.$2');
        if (cnpj.length <= 8) return cnpj.replace(/(\d{2})(\d{3})(\d{1,3})/, '$1.$2.$3');
        if (cnpj.length <= 12) return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{1,4})/, '$1.$2.$3/$4');
        return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})/, '$1.$2.$3/$4-$5');
    };

    const formatarCEP = (valor) => {
        const cep = valor.replace(/\D/g, '');
        if (cep.length <= 5) return cep;
        return cep.replace(/(\d{5})(\d{1,3})/, '$1-$2');
    };

    const abrirModalUsuarios = async (estabelecimento) => {
        setModalUsuarios(estabelecimento);
        await carregarUsuarios(estabelecimento.id);
        setMostrarFormUsuario(false);
        setNomeUsuario('');
        setEmailUsuario('');
        setSenhaUsuario('');
        setPerfilUsuario('atendente');
        setEditandoUsuarioId(null);
        setAlterarSenha(false);
    };

    const handleLimparBusca = () => {
        setBusca('');
    };

    const handleSubmitUsuario = async (e) => {
        e.preventDefault();

        if (!nomeUsuario || !emailUsuario) {
            toast.warning('Preencha nome e email');
            return;
        }

        if (!editandoUsuarioId && !senhaUsuario) {
            toast.warning('Preencha a senha');
            return;
        }

        if (editandoUsuarioId && alterarSenha && !senhaUsuario) {
            toast.warning('Digite a nova senha');
            return;
        }

        setLoading(true);
        try {
            if (editandoUsuarioId) {
                const dados = {
                    nome: nomeUsuario,
                    email: emailUsuario,
                    perfil: perfilUsuario
                };
                if (alterarSenha && senhaUsuario) {
                    dados.senha = senhaUsuario;
                }
                await api.put(`/admin/usuarios/${editandoUsuarioId}`, dados);
                toast.success('Usuário atualizado com sucesso');
            } else {
                await api.post('/admin/usuarios', {
                    nome: nomeUsuario,
                    email: emailUsuario,
                    senha: senhaUsuario,
                    perfil: perfilUsuario,
                    estabelecimento_id: modalUsuarios.id
                });
                toast.success('Usuário criado com sucesso');
            }
            setNomeUsuario('');
            setEmailUsuario('');
            setSenhaUsuario('');
            setPerfilUsuario('atendente');
            setEditandoUsuarioId(null);
            setMostrarFormUsuario(false);
            setAlterarSenha(false);
            await carregarUsuarios(modalUsuarios.id);
        } catch (error) {
            console.error('Erro ao salvar usuario', error);
            toast.error('Erro ao salvar usuário');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUsuario = async (id) => {
        const user = usuarios.find(u => u.id === id);
        setModalConfirmacaoUsuario({ id, nome: user?.nome, estabelecimento: modalUsuarios?.nome });
    };

    const confirmarExclusaoUsuario = async () => {
        if (!modalConfirmacaoUsuario) return;
        try {
            await api.delete(`/admin/usuarios/${modalConfirmacaoUsuario.id}`);
            toast.success('Usuário excluído com sucesso');
            await carregarUsuarios(modalUsuarios.id);
        } catch (error) {
            console.error('Erro ao deletar usuario', error);
            toast.error('Erro ao excluir usuário');
        } finally {
            setModalConfirmacaoUsuario(null);
        }
    };

    const estabelecimentosFiltrados = useMemo(() => {
        return estabelecimentos.filter(e => {
            const buscaLower = busca.toLowerCase();
            const cnpjSemFormatacao = e.cnpj ? e.cnpj.replace(/[^\d]/g, '') : '';
            const buscaSemFormatacao = busca.replace(/[^\d]/g, '');
            
            return e.nome.toLowerCase().includes(buscaLower) ||
                   (e.cnpj && e.cnpj.toLowerCase().includes(buscaLower)) ||
                   (cnpjSemFormatacao && cnpjSemFormatacao.includes(buscaSemFormatacao));
        });
    }, [estabelecimentos, busca]);

    const getPerfilCor = (perfil) => {
        if (perfil === 'dono') return '#28a745';
        if (perfil === 'gerente') return '#007bff';
        if (perfil === 'cozinha') return '#fd7e14';
        return '#6c757d';
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Estabelecimentos</h1>
                    <p className="text-muted">Gerencie todos os estabelecimentos do sistema</p>
                </div>
                <button className="btn btn-primary" onClick={abrirModal}>
                    <FiPlus size={18} style={{ marginRight: 6 }} />
                    Novo Estabelecimento
                </button>
            </div>

            <div className="search-box">
                <FiSearch size={20} className="search-icon" />
                <input
                    type="text"
                    placeholder="Buscar estabelecimento..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />
                {busca && (
                    <button className="search-clear" onClick={handleLimparBusca} title="Limpar busca">
                        <FiX size={18} />
                    </button>
                )}
            </div>

            <div className="card">
                {loading ? (
                    <div className="loading-state">Carregando...</div>
                ) : (
                    <div className="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Estabelecimento</th>
                                    <th>CNPJ</th>
                                    <th>Plano</th>
                                    <th>Status</th>
                                    <th className="text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {estabelecimentosFiltrados.map((est) => (
                                    <tr key={est.id}>
                                        <td>
                                            <div className="produto-info">
                                                <span className="produto-icon"><FiServer size={18} /></span>
                                                {est.nome}
                                            </div>
                                        </td>
                                        <td>{est.cnpj || '-'}</td>
                                        <td><span className="badge">{est.plano || 'gratis'}</span></td>
                                        <td><span className="badge" style={{ backgroundColor: est.status === 'ativo' ? '#6b8c4a' : '#b85a4a', color: 'white' }}>{est.status || 'ativo'}</span></td>
                                        <td>
                                            <div className="acoes">
                                                <button className="btn-icon btn-edit" onClick={() => abrirModal(est)} title="Editar">
                                                    <FiEdit2 size={16} />
                                                </button>
                                                <button className="btn-icon btn-info" onClick={() => setModalDetalhes(est)} title="Ver Detalhes">
                                                    <FiInfo size={16} />
                                                </button>
                                                <button className="btn-icon btn-users" onClick={() => abrirModalUsuarios(est)} title="Gerenciar Usuários">
                                                    <FiUsers size={16} />
                                                </button>
                                                <button className="btn-icon btn-delete" onClick={() => handleDelete(est.id)} title="Excluir">
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {estabelecimentosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">
                                            <FiServer size={32} />
                                            <p>Nenhum estabelecimento cadastrado</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalEdicao && (
                <div className="modal-overlay" onClick={fecharModal}>
                    <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editandoId ? 'Editar Estabelecimento' : 'Novo Estabelecimento'}</h3>
                            <button className="modal-close" onClick={fecharModal}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body-estabelecimento">
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                    <div className="form-group">
                                        <label>Nome *</label>
                                        <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Nome do estabelecimento" />
                                    </div>
                                    <div className="form-group">
                                        <label>CNPJ</label>
                                        <input type="text" value={cnpj} onChange={(e) => setCnpj(formatarCNPJ(e.target.value))} placeholder="00.000.000/0001-00" maxLength={18} />
                                    </div>
                                    <div className="form-group">
                                        <label>Endereço</label>
                                        <input type="text" value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, Av..." />
                                    </div>
                                    <div className="form-group">
                                        <label>Número</label>
                                        <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} placeholder="123" />
                                    </div>
                                    <div className="form-group">
                                        <label>CEP</label>
                                        <input type="text" value={cep} onChange={(e) => setCep(formatarCEP(e.target.value))} placeholder="00000-000" maxLength={9} />
                                    </div>
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select value={estado} onChange={(e) => setEstado(e.target.value)}>
                                            <option value="">Selecione</option>
                                            {estados.map(uf => (
                                                <option key={uf} value={uf}>{uf}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Telefone</label>
                                        <input type="text" value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} placeholder="(00) 00000-0000" maxLength={15} />
                                    </div>
                                    <div className="form-group">
                                        <label>Data de Abertura</label>
                                        <input type="date" value={dataAbertura} onChange={(e) => setDataAbertura(e.target.value)} />
                                    </div>
                                    <div className="form-group">
                                        <label>Nome do Dono</label>
                                        <input type="text" value={nomeDono} onChange={(e) => setNomeDono(e.target.value)} placeholder="Nome do proprietário" />
                                    </div>
                                    <div className="form-group">
                                        <label>CPF do Dono</label>
                                        <input type="text" value={cpfDono} onChange={(e) => setCpfDono(formatarCPF(e.target.value))} placeholder="000.000.000-00" maxLength={14} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Plano</label>
                                    <select value={plano} onChange={(e) => setPlano(e.target.value)}>
                                        <option value="gratis">Grátis</option>
                                        <option value="basico">Básico</option>
                                        <option value="profissional">Profissional</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Observações</label>
                                    <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)} placeholder="Informações adicionais..." rows={2} />
                                </div>
                                <div style={{ display: 'flex', gap: 10 }}>
                                    <button type="submit" className="btn btn-primary" disabled={loading}>
                                        {loading ? 'Salvando...' : (editandoId ? 'Atualizar' : 'Cadastrar')}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={fecharModal}>
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {modalConfirmacao && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Confirmar Exclusão</h3>
                            <button className="modal-close" onClick={() => setModalConfirmacao(null)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <FiAlertCircle size={32} className="modal-icon-warning" />
                            <p>Tem certeza que deseja excluir o estabelecimento <strong>"{modalConfirmacao.nome}"</strong>?</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>CNPJ: {modalConfirmacao.cnpj}</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalConfirmacao(null)}>Cancelar</button>
                            <button className="btn btn-danger" onClick={confirmarExclusao}><FiTrash2 size={16} /> Excluir</button>
                        </div>
                    </div>
                </div>
            )}

            {modalDetalhes && (
                <div className="modal-overlay" onClick={() => setModalDetalhes(null)}>
                    <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Detalhes do Estabelecimento</h3>
                            <button className="modal-close" onClick={() => setModalDetalhes(null)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <div><strong>Nome:</strong> {modalDetalhes.nome}</div>
                                <div><strong>CNPJ:</strong> {modalDetalhes.cnpj || '-'}</div>
                                <div><strong>Endereço:</strong> {modalDetalhes.endereco || '-'}</div>
                                <div><strong>Número:</strong> {modalDetalhes.numero || '-'}</div>
                                <div><strong>CEP:</strong> {modalDetalhes.cep || '-'}</div>
                                <div><strong>Estado:</strong> {modalDetalhes.estado || '-'}</div>
                                <div><strong>Telefone:</strong> {modalDetalhes.telefone || '-'}</div>
                                <div><strong>Data Abertura:</strong> {modalDetalhes.data_abertura ? new Date(modalDetalhes.data_abertura).toLocaleDateString('pt-BR') : '-'}</div>
                                <div><strong>Nome do Dono:</strong> {modalDetalhes.nome_dono || '-'}</div>
                                <div><strong>CPF do Dono:</strong> {modalDetalhes.cpf_dono || '-'}</div>
                                <div><strong>Plano:</strong> {modalDetalhes.plano || 'gratis'}</div>
                                <div><strong>Status:</strong> {modalDetalhes.status || 'ativo'}</div>
                                <div style={{ gridColumn: '1 / -1' }}><strong>Observações:</strong> {modalDetalhes.observacoes || 'Nenhuma observação'}</div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalDetalhes(null)}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalUsuarios && (
                <div className="modal-overlay" onClick={() => { setModalUsuarios(null); setMostrarFormUsuario(false); }}>
                    <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Usuários - {modalUsuarios.nome}</h3>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button className="btn btn-primary" onClick={() => { setMostrarFormUsuario(!mostrarFormUsuario); setEditandoUsuarioId(null); setNomeUsuario(''); setEmailUsuario(''); setSenhaUsuario(''); setPerfilUsuario('atendente'); setAlterarSenha(false); }}>
                                    <FiPlus size={16} /> Novo
                                </button>
                                <button className="modal-close" onClick={() => { setModalUsuarios(null); setMostrarFormUsuario(false); }}>
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="modal-body">
                            {mostrarFormUsuario && (
                                <div className="card" style={{ marginBottom: 16 }}>
                                    <h4>{editandoUsuarioId ? 'Editar Usuário' : 'Novo Usuário'}</h4>
                                    <form onSubmit={handleSubmitUsuario}>
                                        <div className="form-group">
                                            <label>Nome</label>
                                            <input type="text" value={nomeUsuario} onChange={(e) => setNomeUsuario(e.target.value)} required placeholder="Nome do usuário" />
                                        </div>
                                        <div className="form-group">
                                            <label>Email</label>
                                            <input type="email" value={emailUsuario} onChange={(e) => setEmailUsuario(e.target.value)} required placeholder="email@exemplo.com" />
                                        </div>
                                        {!editandoUsuarioId ? (
                                            <div className="form-group">
                                                <label>Senha</label>
                                                <input type="password" value={senhaUsuario} onChange={(e) => setSenhaUsuario(e.target.value)} required placeholder="Digite a senha" />
                                            </div>
                                        ) : (
                                            <div className="form-group">
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={alterarSenha}
                                                        onChange={(e) => {
                                                            setAlterarSenha(e.target.checked);
                                                            if (!e.target.checked) setSenhaUsuario('');
                                                        }}
                                                        style={{ width: 'auto' }}
                                                    />
                                                    <label style={{ margin: 0 }}>Alterar senha</label>
                                                </div>
                                                {alterarSenha && (
                                                    <input
                                                        type="password"
                                                        value={senhaUsuario}
                                                        onChange={(e) => setSenhaUsuario(e.target.value)}
                                                        placeholder="Digite a nova senha"
                                                        required={alterarSenha}
                                                    />
                                                )}
                                            </div>
                                        )}
                                        <div className="form-group">
                                            <label>Perfil</label>
                                            <select value={perfilUsuario} onChange={(e) => setPerfilUsuario(e.target.value)}>
                                                {perfis.map(p => (
                                                    <option key={p.valor} value={p.valor}>{p.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', gap: 10 }}>
                                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                                {loading ? 'Salvando...' : (editandoUsuarioId ? 'Atualizar' : 'Cadastrar')}
                                            </button>
                                            <button type="button" className="btn btn-secondary" onClick={() => { setMostrarFormUsuario(false); setEditandoUsuarioId(null); setNomeUsuario(''); setEmailUsuario(''); setSenhaUsuario(''); setPerfilUsuario('atendente'); setAlterarSenha(false); }}>
                                                Cancelar
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Perfil</th>
                                            <th className="text-center">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {usuarios.map((user) => (
                                            <tr key={user.id}>
                                                <td><FiUser size={16} style={{ marginRight: 8 }} />{user.nome}</td>
                                                <td>{user.email}</td>
                                                <td><span className="badge" style={{ backgroundColor: getPerfilCor(user.perfil), color: 'white' }}>{user.perfil}</span></td>
                                                <td>
                                                    <div className="acoes">
                                                        <button className="btn-icon btn-edit" onClick={() => { setEditandoUsuarioId(user.id); setNomeUsuario(user.nome); setEmailUsuario(user.email); setPerfilUsuario(user.perfil); setMostrarFormUsuario(true); setAlterarSenha(false); setSenhaUsuario(''); }} title="Editar">
                                                            <FiEdit2 size={16} />
                                                        </button>
                                                        <button className="btn-icon btn-delete" onClick={() => handleDeleteUsuario(user.id)} title="Excluir">
                                                            <FiTrash2 size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {usuarios.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="text-center text-muted">
                                                    <FiUser size={32} />
                                                    <p>Nenhum usuário neste estabelecimento</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => { setModalUsuarios(null); setMostrarFormUsuario(false); }}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}

            {modalConfirmacaoUsuario && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <h3>Confirmar Exclusão</h3>
                            <button className="modal-close" onClick={() => setModalConfirmacaoUsuario(null)}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <FiAlertCircle size={32} className="modal-icon-warning" />
                            <p>Tem certeza que deseja excluir o usuário <strong>"{modalConfirmacaoUsuario.nome}"</strong> do estabelecimento <strong>"{modalConfirmacaoUsuario.estabelecimento}"</strong>?</p>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setModalConfirmacaoUsuario(null)}>Cancelar</button>
                            <button className="btn btn-danger" onClick={confirmarExclusaoUsuario}><FiTrash2 size={16} /> Excluir</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Estabelecimentos;