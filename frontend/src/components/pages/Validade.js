import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function Validade() {
    const [validades, setValidades] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const [vencendo, setVencendo] = useState([]);
    const [ingredienteId, setIngredienteId] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [dataValidade, setDataValidade] = useState('');
    const [lote, setLote] = useState('');

    useEffect(() => {
        carregarValidades();
        carregarIngredientes();
        carregarVencendo();
    }, []);

    const carregarValidades = async () => {
        try {
            const response = await api.get('/validade');
            setValidades(response.data);
        } catch (error) {
            console.error('Erro ao carregar validades', error);
        }
    };

    const carregarIngredientes = async () => {
        try {
            const response = await api.get('/ingredientes');
            setIngredientes(response.data);
        } catch (error) {
            console.error('Erro ao carregar ingredientes', error);
        }
    };

    const carregarVencendo = async () => {
        try {
            const response = await api.get('/validade/vencendo?dias=7');
            setVencendo(response.data);
        } catch (error) {
            console.error('Erro ao carregar produtos vencendo', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!ingredienteId || !quantidade || !dataValidade) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        try {
            await api.post('/validade', {
                ingrediente_id: parseInt(ingredienteId),
                quantidade: parseFloat(quantidade),
                data_validade: dataValidade,
                lote
            });
            setIngredienteId('');
            setQuantidade('');
            setDataValidade('');
            setLote('');
            carregarValidades();
            carregarVencendo();
            alert('Validade registrada com sucesso!');
        } catch (error) {
            console.error('Erro ao registrar validade', error);
            alert('Erro ao registrar validade');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir?')) {
            try {
                await api.delete(`/validade/${id}`);
                carregarValidades();
                carregarVencendo();
            } catch (error) {
                console.error('Erro ao excluir', error);
            }
        }
    };

    const getDiasRestantes = (dataValidade) => {
        const hoje = new Date();
        const validade = new Date(dataValidade);
        const diffTime = validade - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const imprimirEtiqueta = (validade) => {
        const dias = getDiasRestantes(validade.data_validade);
        const conteudo = `
            <html>
            <head>
                <title>Etiqueta de Validade</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                    .etiqueta { 
                        border: 1px dashed #333; 
                        padding: 15px; 
                        width: 250px; 
                        text-align: center;
                        font-family: Arial, sans-serif;
                    }
                    .produto { font-size: 16px; font-weight: bold; margin-bottom: 10px; }
                    .validade { color: #dc3545; font-weight: bold; margin: 10px 0; font-size: 14px; }
                    .dias { font-size: 12px; margin: 5px 0; }
                    .lote { font-size: 11px; color: #6c757d; margin-top: 10px; }
                    .barra { 
                        height: 30px; 
                        background: repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 6px);
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                <div class="etiqueta">
                    <div class="barra"></div>
                    <div class="produto">${validade.ingrediente_nome}</div>
                    <div>Validade: ${new Date(validade.data_validade).toLocaleDateString('pt-BR')}</div>
                    <div class="validade">⚠️ ${dias} dias restantes</div>
                    ${validade.lote ? `<div class="lote">Lote: ${validade.lote}</div>` : ''}
                    <div class="barra"></div>
                </div>
            </body>
            </html>
        `;
        const janela = window.open();
        janela.document.write(conteudo);
        janela.print();
    };

    return (
        <div>
            {vencendo.length > 0 && (
                <div className="card" style={{ backgroundColor: '#fff3cd', borderColor: '#ffc107', marginBottom: 20 }}>
                    <h3 style={{ color: '#856404' }}>⚠️ Produtos Vencendo em até 7 dias</h3>
                    <ul>
                        {vencendo.map((v) => {
                            const dias = getDiasRestantes(v.data_validade);
                            return (
                                <li key={v.id} style={{ marginBottom: 5 }}>
                                    <strong>{v.ingrediente_nome}</strong> - {v.quantidade} {v.unidade} - 
                                    Vence em {dias} dias ({new Date(v.data_validade).toLocaleDateString('pt-BR')})
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <div className="card">
                <h2>Registrar Validade</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Ingrediente *</label>
                        <select value={ingredienteId} onChange={(e) => setIngredienteId(e.target.value)} required>
                            <option value="">Selecione um ingrediente</option>
                            {ingredientes.map(ing => (
                                <option key={ing.id} value={ing.id}>{ing.nome}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Quantidade *</label>
                        <input type="number" step="0.01" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Data de Validade *</label>
                        <input type="date" value={dataValidade} onChange={(e) => setDataValidade(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Lote (opcional)</label>
                        <input type="text" value={lote} onChange={(e) => setLote(e.target.value)} placeholder="Número do lote" />
                    </div>
                    <button type="submit" className="btn btn-primary">Registrar Validade</button>
                </form>
            </div>

            <div className="card">
                <h2>Lista de Validades</h2>
                <table style={{ width: '100%' }}>
                    <thead>
                        <tr>
                            <th>Ingrediente</th>
                            <th>Quantidade</th>
                            <th>Validade</th>
                            <th>Dias Restantes</th>
                            <th>Lote</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validades.map((v) => {
                            const dias = getDiasRestantes(v.data_validade);
                            let cor = '#28a745';
                            if (dias <= 3) cor = '#dc3545';
                            else if (dias <= 7) cor = '#ffc107';
                            return (
                                <tr key={v.id}>
                                    <td>{v.ingrediente_nome}</td>
                                    <td>{v.quantidade} {v.unidade}</td>
                                    <td>{new Date(v.data_validade).toLocaleDateString('pt-BR')}</td>
                                    <td style={{ color: cor, fontWeight: 'bold' }}>{dias} dias</td>
                                    <td>{v.lote || '-'}</td>
                                    <td>
                                        <button className="btn" style={{ marginRight: 5, backgroundColor: '#17a2b8', color: 'white' }} onClick={() => imprimirEtiqueta(v)}>
                                            🖨️ Etiqueta
                                        </button>
                                        <button className="btn btn-danger" onClick={() => handleDelete(v.id)}>
                                            Excluir
                                        </button>
                                    </td>
                                 </tr>
                            );
                        })}
                        {validades.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center' }}>Nenhum registro de validade</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Validade;