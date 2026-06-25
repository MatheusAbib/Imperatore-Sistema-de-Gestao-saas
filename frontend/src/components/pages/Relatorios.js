import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import api from '../../services/api';
import { FiFileText, FiDownload, FiFile, FiPackage, FiBox, FiCalendar, FiEye, FiX, FiChevronDown, FiBarChart2 } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Relatorios() {
    const [produtos, setProdutos] = useState([]);
    const [ingredientes, setIngredientes] = useState([]);
    const [lotes, setLotes] = useState([]);
    const [analiseVendas, setAnaliseVendas] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);
    const [formatoCompleto, setFormatoCompleto] = useState('excel');
    const [dropdownAberto, setDropdownAberto] = useState(false);

    useEffect(() => {
        carregarDados();
    }, []);

    const carregarDados = async () => {
        setLoading(true);
        try {
            const [prodRes, ingRes, lotesRes, analiseRes] = await Promise.all([
                api.get('/produtos'),
                api.get('/ingredientes'),
                api.get('/lotes'),
                api.get('/analise/vendas')
            ]);
            setProdutos(prodRes.data);
            setIngredientes(ingRes.data);
            setLotes(lotesRes.data);
            setAnaliseVendas(analiseRes.data);
        } catch (error) {
            console.error('Erro ao carregar dados', error);
            toast.error('Erro ao carregar dados');
        } finally {
            setLoading(false);
        }
    };

    const gerarPDF = (titulo, cabecalho, dados) => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        
        doc.setFontSize(18);
        doc.text(titulo, pageWidth / 2, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth / 2, 30, { align: 'center' });
        doc.text('Imperatore - Sistema de Gestão', pageWidth / 2, 37, { align: 'center' });
        
        let y = 50;
        doc.setFontSize(9);
        
        const colWidth = (pageWidth - 28) / cabecalho.length;
        
        doc.setFont('helvetica', 'bold');
        cabecalho.forEach((col, i) => {
            doc.text(col, 14 + (i * colWidth), y);
        });
        
        doc.line(14, y + 2, pageWidth - 14, y + 2);
        y += 8;
        doc.setFont('helvetica', 'normal');
        
        dados.forEach(row => {
            row.forEach((cell, i) => {
                doc.text(String(cell).substring(0, 30), 14 + (i * colWidth), y);
            });
            y += 6;
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
        
        doc.save(`${titulo.toLowerCase().replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('PDF gerado com sucesso!');
    };

    const exportarAnaliseVendasExcel = () => {
        if (!analiseVendas || !analiseVendas.produtos) {
            toast.warning('Nenhum dado de venda disponível');
            return;
        }

        const dados = analiseVendas.produtos.map(p => ({
            'Produto': p.produto_nome,
            'Quantidade Vendida': parseFloat(p.total_vendido),
            'Faturamento Total': parseFloat(p.faturamento_total),
            'Custo Unitário': parseFloat(p.custo),
            'Lucro Total': parseFloat(p.lucro_total),
            'Margem (%)': parseFloat(p.margem).toFixed(1) + '%'
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(dados);
        XLSX.utils.book_append_sheet(wb, ws, 'Analise Vendas');

        if (analiseVendas.resumo) {
            const resumoDados = [{
                'Faturamento Total': parseFloat(analiseVendas.resumo.faturamento_geral).toFixed(2),
                'Lucro Total': parseFloat(analiseVendas.resumo.lucro_geral).toFixed(2),
                'Margem Geral': parseFloat(analiseVendas.resumo.margem_geral).toFixed(1) + '%',
                'Total Produtos': analiseVendas.resumo.total_produtos
            }];
            const wsResumo = XLSX.utils.json_to_sheet(resumoDados);
            XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
        }

        XLSX.writeFile(wb, `analise_vendas_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel gerado com sucesso!');
    };

    const exportarAnaliseVendasPDF = () => {
        if (!analiseVendas || !analiseVendas.produtos || analiseVendas.produtos.length === 0) {
            toast.warning('Nenhum dado de venda disponível');
            return;
        }

        const cabecalho = ['Produto', 'Quantidade', 'Faturamento', 'Lucro', 'Margem'];
        const dados = analiseVendas.produtos.map(p => [
            p.produto_nome,
            parseFloat(p.total_vendido),
            `R$ ${parseFloat(p.faturamento_total).toFixed(2).replace('.', ',')}`,
            `R$ ${parseFloat(p.lucro_total).toFixed(2).replace('.', ',')}`,
            `${parseFloat(p.margem).toFixed(1)}%`
        ]);

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        doc.setFontSize(18);
        doc.text('Análise de Vendas', pageWidth / 2, y, { align: 'center' });
        y += 10;

        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth / 2, y, { align: 'center' });
        y += 10;

        if (analiseVendas.resumo) {
            doc.setFontSize(11);
            doc.text(`Faturamento Total: R$ ${parseFloat(analiseVendas.resumo.faturamento_geral).toFixed(2).replace('.', ',')}`, 14, y);
            y += 6;
            doc.text(`Lucro Total: R$ ${parseFloat(analiseVendas.resumo.lucro_geral).toFixed(2).replace('.', ',')}`, 14, y);
            y += 6;
            doc.text(`Margem Geral: ${parseFloat(analiseVendas.resumo.margem_geral).toFixed(1)}%`, 14, y);
            y += 10;
        }

        const colWidth = (pageWidth - 28) / cabecalho.length;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        cabecalho.forEach((col, i) => {
            doc.text(col, 14 + (i * colWidth), y);
        });
        doc.line(14, y + 2, pageWidth - 14, y + 2);
        y += 8;
        doc.setFont('helvetica', 'normal');

        dados.forEach(row => {
            row.forEach((cell, i) => {
                doc.text(String(cell).substring(0, 30), 14 + (i * colWidth), y);
            });
            y += 6;
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });

        doc.save(`analise_vendas_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('PDF gerado com sucesso!');
    };

    const exportarProdutosExcel = () => {
        const dados = produtos.map(p => ({
            'Produto': p.nome,
            'Categoria': p.categoria || '-',
            'Preco Venda': parseFloat(p.preco_venda),
            'Custo Preparo': parseFloat(p.custo),
            'Margem de Lucro': p.margem + '%',
            'Lucro (R$)': (parseFloat(p.preco_venda) - parseFloat(p.custo)).toFixed(2)
        }));
        const ws = XLSX.utils.json_to_sheet(dados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Produtos');
        XLSX.writeFile(wb, `produtos_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel gerado com sucesso!');
    };

    const exportarProdutosPDF = () => {
        const cabecalho = ['Produto', 'Categoria', 'Preco', 'Custo', 'Margem', 'Lucro (R$)'];
        const dados = produtos.map(p => [
            p.nome,
            p.categoria || '-',
            `R$ ${parseFloat(p.preco_venda).toFixed(2).replace('.', ',')}`,
            `R$ ${parseFloat(p.custo).toFixed(2).replace('.', ',')}`,
            `${p.margem}%`,
            `R$ ${(parseFloat(p.preco_venda) - parseFloat(p.custo)).toFixed(2).replace('.', ',')}`
        ]);
        gerarPDF('Relatorio de Produtos', cabecalho, dados);
    };

    const exportarIngredientesExcel = () => {
        const dados = ingredientes.map(i => ({
            'Ingrediente': i.nome,
            'Unidade Compra': i.unidade,
            'Unidade Uso': i.unidade_uso || i.unidade,
            'Custo Compra': parseFloat(i.custo_medio),
            'Fator Conversao': parseFloat(i.fator_conversao) || 1,
            'Custo Unitario': (parseFloat(i.custo_medio) / (parseFloat(i.fator_conversao) || 1)).toFixed(4)
        }));
        const ws = XLSX.utils.json_to_sheet(dados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Ingredientes');
        XLSX.writeFile(wb, `ingredientes_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel gerado com sucesso!');
    };

    const exportarIngredientesPDF = () => {
        const cabecalho = ['Ingrediente', 'Unid. Compra', 'Unid. Uso', 'Custo Compra', 'Custo Unitario'];
        const dados = ingredientes.map(i => [
            i.nome,
            i.unidade,
            i.unidade_uso || i.unidade,
            `R$ ${parseFloat(i.custo_medio).toFixed(2).replace('.', ',')}`,
            `R$ ${(parseFloat(i.custo_medio) / (parseFloat(i.fator_conversao) || 1)).toFixed(4).replace('.', ',')}`
        ]);
        gerarPDF('Relatorio de Ingredientes', cabecalho, dados);
    };

    const exportarLotesExcel = () => {
        const dados = lotes.map(l => {
            const dias = Math.ceil((new Date(l.data_validade) - new Date()) / (1000 * 60 * 60 * 24));
            let status = 'OK';
            if (dias < 0) status = 'Vencido';
            else if (dias === 0) status = 'Vence Hoje';
            else if (dias <= 7) status = 'Vence em breve';
            
            return {
                'Ingrediente': l.ingrediente_nome,
                'Lote': l.lote || '-',
                'Quantidade': l.quantidade,
                'Unidade': l.unidade,
                'Data Validade': new Date(l.data_validade).toLocaleDateString('pt-BR'),
                'Dias Restantes': dias,
                'Status': status
            };
        });
        const ws = XLSX.utils.json_to_sheet(dados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Lotes');
        XLSX.writeFile(wb, `lotes_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Excel gerado com sucesso!');
    };

    const exportarLotesPDF = () => {
        const cabecalho = ['Ingrediente', 'Lote', 'Quantidade', 'Validade', 'Status'];
        const dados = lotes.map(l => {
            const dias = Math.ceil((new Date(l.data_validade) - new Date()) / (1000 * 60 * 60 * 24));
            let status = 'OK';
            if (dias < 0) status = 'Vencido';
            else if (dias === 0) status = 'Vence Hoje';
            else if (dias <= 7) status = 'Vence em breve';
            
            return [
                l.ingrediente_nome,
                l.lote || '-',
                `${l.quantidade} ${l.unidade}`,
                new Date(l.data_validade).toLocaleDateString('pt-BR'),
                status
            ];
        });
        gerarPDF('Relatorio de Lotes', cabecalho, dados);
    };

    const exportarRelatorioCompletoExcel = () => {
        const dados = {
            'Produtos': produtos.map(p => ({
                'Produto': p.nome,
                'Categoria': p.categoria || '-',
                'Preco': parseFloat(p.preco_venda),
                'Custo': parseFloat(p.custo),
                'Margem': p.margem + '%',
                'Lucro': (parseFloat(p.preco_venda) - parseFloat(p.custo)).toFixed(2)
            })),
            'Ingredientes': ingredientes.map(i => ({
                'Ingrediente': i.nome,
                'Unid. Compra': i.unidade,
                'Unid. Uso': i.unidade_uso || i.unidade,
                'Custo': parseFloat(i.custo_medio),
                'Fator': parseFloat(i.fator_conversao) || 1,
                'Custo Unitario': (parseFloat(i.custo_medio) / (parseFloat(i.fator_conversao) || 1)).toFixed(4)
            })),
            'Lotes': lotes.map(l => ({
                'Ingrediente': l.ingrediente_nome,
                'Lote': l.lote || '-',
                'Quantidade': l.quantidade,
                'Validade': new Date(l.data_validade).toLocaleDateString('pt-BR')
            }))
        };

        if (analiseVendas && analiseVendas.produtos && analiseVendas.produtos.length > 0) {
            dados['Analise Vendas'] = analiseVendas.produtos.map(p => ({
                'Produto': p.produto_nome,
                'Quantidade': parseFloat(p.total_vendido),
                'Faturamento': parseFloat(p.faturamento_total),
                'Lucro': parseFloat(p.lucro_total),
                'Margem': parseFloat(p.margem).toFixed(1) + '%'
            }));
        }

        const wb = XLSX.utils.book_new();
        
        Object.keys(dados).forEach(sheetName => {
            const ws = XLSX.utils.json_to_sheet(dados[sheetName]);
            XLSX.utils.book_append_sheet(wb, ws, sheetName);
        });

        XLSX.writeFile(wb, `relatorio_completo_${new Date().toISOString().split('T')[0]}.xlsx`);
        toast.success('Relatório completo gerado com sucesso!');
    };

    const exportarRelatorioCompletoPDF = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        let y = 20;

        const addSection = (titulo, cabecalho, dados) => {
            if (!dados || dados.length === 0) return;

            if (y > 250) {
                doc.addPage();
                y = 20;
            }

            doc.setFontSize(16);
            doc.text(titulo, 14, y);
            y += 10;

            doc.setFontSize(9);
            const colWidth = (pageWidth - 28) / cabecalho.length;
            
            doc.setFont('helvetica', 'bold');
            cabecalho.forEach((col, i) => {
                doc.text(col, 14 + (i * colWidth), y);
            });
            
            doc.line(14, y + 2, pageWidth - 14, y + 2);
            y += 8;
            doc.setFont('helvetica', 'normal');
            
            dados.forEach(row => {
                row.forEach((cell, i) => {
                    doc.text(String(cell).substring(0, 30), 14 + (i * colWidth), y);
                });
                y += 6;
                if (y > 270) {
                    doc.addPage();
                    y = 20;
                }
            });
            y += 10;
        };

        doc.setFontSize(18);
        doc.text('Relatorio Completo', pageWidth / 2, 20, { align: 'center' });
        doc.setFontSize(10);
        doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}`, pageWidth / 2, 30, { align: 'center' });
        doc.text('Imperatore - Sistema de Gestão', pageWidth / 2, 37, { align: 'center' });
        y = 50;

        const prodCab = ['Produto', 'Categoria', 'Preco', 'Custo', 'Margem', 'Lucro'];
        const prodDados = produtos.map(p => [
            p.nome,
            p.categoria || '-',
            `R$ ${parseFloat(p.preco_venda).toFixed(2).replace('.', ',')}`,
            `R$ ${parseFloat(p.custo).toFixed(2).replace('.', ',')}`,
            `${p.margem}%`,
            `R$ ${(parseFloat(p.preco_venda) - parseFloat(p.custo)).toFixed(2).replace('.', ',')}`
        ]);
        addSection('Produtos', prodCab, prodDados);

        const ingCab = ['Ingrediente', 'Unid. Compra', 'Unid. Uso', 'Custo', 'Custo Unitario'];
        const ingDados = ingredientes.map(i => [
            i.nome,
            i.unidade,
            i.unidade_uso || i.unidade,
            `R$ ${parseFloat(i.custo_medio).toFixed(2).replace('.', ',')}`,
            `R$ ${(parseFloat(i.custo_medio) / (parseFloat(i.fator_conversao) || 1)).toFixed(4).replace('.', ',')}`
        ]);
        addSection('Ingredientes', ingCab, ingDados);

        const lotCab = ['Ingrediente', 'Lote', 'Quantidade', 'Validade'];
        const lotDados = lotes.map(l => [
            l.ingrediente_nome,
            l.lote || '-',
            `${l.quantidade} ${l.unidade}`,
            new Date(l.data_validade).toLocaleDateString('pt-BR')
        ]);
        addSection('Lotes', lotCab, lotDados);

        if (analiseVendas && analiseVendas.produtos && analiseVendas.produtos.length > 0) {
            const analiseCab = ['Produto', 'Quantidade', 'Faturamento', 'Lucro', 'Margem'];
            const analiseDados = analiseVendas.produtos.map(p => [
                p.produto_nome,
                parseFloat(p.total_vendido),
                `R$ ${parseFloat(p.faturamento_total).toFixed(2).replace('.', ',')}`,
                `R$ ${parseFloat(p.lucro_total).toFixed(2).replace('.', ',')}`,
                `${parseFloat(p.margem).toFixed(1)}%`
            ]);
            addSection('Análise de Vendas', analiseCab, analiseDados);
        }

        doc.save(`relatorio_completo_${new Date().toISOString().split('T')[0]}.pdf`);
        toast.success('Relatório completo gerado com sucesso!');
    };

    const exportarRelatorioCompleto = () => {
        if (formatoCompleto === 'excel') {
            exportarRelatorioCompletoExcel();
        } else {
            exportarRelatorioCompletoPDF();
        }
        setDropdownAberto(false);
    };

    const abrirPreview = (tipo) => {
        setPreview(tipo);
    };

    const fecharPreview = () => {
        setPreview(null);
    };

    const getDadosPreview = () => {
        if (preview === 'produtos') {
            return {
                titulo: 'Produtos',
                cabecalho: ['Produto', 'Categoria', 'Preco', 'Custo', 'Margem', 'Lucro'],
                dados: produtos.slice(0, 5).map(p => [
                    p.nome,
                    p.categoria || '-',
                    `R$ ${parseFloat(p.preco_venda).toFixed(2).replace('.', ',')}`,
                    `R$ ${parseFloat(p.custo).toFixed(2).replace('.', ',')}`,
                    `${p.margem}%`,
                    `R$ ${(parseFloat(p.preco_venda) - parseFloat(p.custo)).toFixed(2).replace('.', ',')}`
                ]),
                total: produtos.length
            };
        }
        if (preview === 'ingredientes') {
            return {
                titulo: 'Ingredientes',
                cabecalho: ['Ingrediente', 'Unid. Compra', 'Unid. Uso', 'Custo', 'Custo Unitario'],
                dados: ingredientes.slice(0, 5).map(i => [
                    i.nome,
                    i.unidade,
                    i.unidade_uso || i.unidade,
                    `R$ ${parseFloat(i.custo_medio).toFixed(2).replace('.', ',')}`,
                    `R$ ${(parseFloat(i.custo_medio) / (parseFloat(i.fator_conversao) || 1)).toFixed(4).replace('.', ',')}`
                ]),
                total: ingredientes.length
            };
        }
        if (preview === 'lotes') {
            return {
                titulo: 'Lotes',
                cabecalho: ['Ingrediente', 'Lote', 'Quantidade', 'Validade'],
                dados: lotes.slice(0, 5).map(l => [
                    l.ingrediente_nome,
                    l.lote || '-',
                    `${l.quantidade} ${l.unidade}`,
                    new Date(l.data_validade).toLocaleDateString('pt-BR')
                ]),
                total: lotes.length
            };
        }
        if (preview === 'analise') {
            if (!analiseVendas || !analiseVendas.produtos || analiseVendas.produtos.length === 0) {
                return {
                    titulo: 'Análise de Vendas',
                    cabecalho: ['Nenhum dado disponível'],
                    dados: [],
                    total: 0
                };
            }
            return {
                titulo: 'Análise de Vendas',
                cabecalho: ['Produto', 'Quantidade', 'Faturamento', 'Lucro', 'Margem'],
                dados: analiseVendas.produtos.slice(0, 5).map(p => [
                    p.produto_nome,
                    parseFloat(p.total_vendido),
                    `R$ ${parseFloat(p.faturamento_total).toFixed(2).replace('.', ',')}`,
                    `R$ ${parseFloat(p.lucro_total).toFixed(2).replace('.', ',')}`,
                    `${parseFloat(p.margem).toFixed(1)}%`
                ]),
                total: analiseVendas.produtos.length
            };
        }
        return null;
    };

    const previewData = getDadosPreview();

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} theme="dark" />

            <div className="page-header">
                <div>
                    <h1>Relatórios</h1>
                    <p className="text-muted">Exporte dados do sistema em diferentes formatos</p>
                </div>
            </div>


<div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <FiBarChart2 size={22} color="#6b8c4a" />
        <h3 style={{ margin: 0 }}>Análise de Vendas</h3>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {analiseVendas?.produtos?.length || 0} produtos com venda
        </span>
    </div>
    {loading ? (
        <div className="skeleton-container">
            <div className="skeleton-card" style={{ height: 40, minHeight: 40 }}></div>
        </div>
    ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" onClick={exportarAnaliseVendasExcel} style={{ backgroundColor: '#6b8c4a', color: 'white' }}>
                <FiFile size={16} /> Excel
            </button>
            <button className="btn" onClick={exportarAnaliseVendasPDF} style={{ backgroundColor: '#6b8c4a', color: 'white' }}>
                <FiFileText size={16} /> PDF
            </button>
            <button className="btn" onClick={() => abrirPreview('analise')} style={{ backgroundColor: '#6b8c4a', color: 'white' }}>
                <FiEye size={16} /> Prévia
            </button>
        </div>
    )}
</div>

<div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <FiPackage size={22} color="#b85a3a" />
        <h3 style={{ margin: 0 }}>Produtos</h3>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {produtos.length} registros
        </span>
    </div>
    {loading ? (
        <div className="skeleton-container">
            <div className="skeleton-card" style={{ height: 40, minHeight: 40 }}></div>
        </div>
    ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" onClick={exportarProdutosExcel} style={{ backgroundColor: '#b85a3a', color: 'white' }}>
                <FiFile size={16} /> Excel
            </button>
            <button className="btn" onClick={exportarProdutosPDF} style={{ backgroundColor: '#b85a3a', color: 'white' }}>
                <FiFileText size={16} /> PDF
            </button>
            <button className="btn" onClick={() => abrirPreview('produtos')} style={{ backgroundColor: '#b85a3a', color: 'white' }}>
                <FiEye size={16} /> Prévia
            </button>
        </div>
    )}
</div>

<div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <FiBox size={22} color="#5a7a8c" />
        <h3 style={{ margin: 0 }}>Ingredientes</h3>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {ingredientes.length} registros
        </span>
    </div>
    {loading ? (
        <div className="skeleton-container">
            <div className="skeleton-card" style={{ height: 40, minHeight: 40 }}></div>
        </div>
    ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" onClick={exportarIngredientesExcel} style={{ backgroundColor: '#5a7a8c', color: 'white' }}>
                <FiFile size={16} /> Excel
            </button>
            <button className="btn" onClick={exportarIngredientesPDF} style={{ backgroundColor: '#5a7a8c', color: 'white' }}>
                <FiFileText size={16} /> PDF
            </button>
            <button className="btn" onClick={() => abrirPreview('ingredientes')} style={{ backgroundColor: '#5a7a8c', color: 'white' }}>
                <FiEye size={16} /> Prévia
            </button>
        </div>
    )}
</div>

<div className="card">
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <FiCalendar size={22} color="#c4884a" />
        <h3 style={{ margin: 0 }}>Lotes / Validade</h3>
        <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {lotes.length} registros
        </span>
    </div>
    {loading ? (
        <div className="skeleton-container">
            <div className="skeleton-card" style={{ height: 40, minHeight: 40 }}></div>
        </div>
    ) : (
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn" onClick={exportarLotesExcel} style={{ backgroundColor: '#c4884a', color: 'white' }}>
                <FiFile size={16} /> Excel
            </button>
            <button className="btn" onClick={exportarLotesPDF} style={{ backgroundColor: '#c4884a', color: 'white' }}>
                <FiFileText size={16} /> PDF
            </button>
            <button className="btn" onClick={() => abrirPreview('lotes')} style={{ backgroundColor: '#c4884a', color: 'white' }}>
                <FiEye size={16} /> Prévia
            </button>
        </div>
    )}
</div>

<div className="card" style={{ backgroundColor: 'var(--bg-hover)', border: '2px dashed var(--primary)' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
        <FiDownload size={24} color="var(--primary)" />
        <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: 16 }}>Relatório Completo</h3>
            <p className="text-muted" style={{ fontSize: 13, margin: 0 }}>
                Exporta todos os dados em um único arquivo (Produtos, Ingredientes, Lotes e Análise de Vendas)
            </p>
        </div>
        <div style={{ position: 'relative' }}>
            <button 
                className="btn" 
                onClick={() => setDropdownAberto(!dropdownAberto)}
                style={{ backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', gap: 8 }}
            >
                <FiDownload size={16} /> 
                {formatoCompleto === 'excel' ? 'Excel' : 'PDF'}
                <FiChevronDown size={14} />
            </button>
            {dropdownAberto && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: 0,
                    marginTop: 4,
                    backgroundColor: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    zIndex: 100,
                    minWidth: 120,
                    overflow: 'hidden'
                }}>
                    <button
                        className="btn"
                        onClick={() => {
                            setFormatoCompleto('excel');
                            setDropdownAberto(false);
                            exportarRelatorioCompletoExcel();
                        }}
                        style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 16px',
                            borderRadius: 0,
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <FiFile size={14} style={{ marginRight: 8 }} /> Excel
                    </button>
                    <button
                        className="btn"
                        onClick={() => {
                            setFormatoCompleto('pdf');
                            setDropdownAberto(false);
                            exportarRelatorioCompletoPDF();
                        }}
                        style={{
                            display: 'block',
                            width: '100%',
                            textAlign: 'left',
                            padding: '8px 16px',
                            borderRadius: 0,
                            backgroundColor: 'transparent',
                            color: 'var(--text-primary)'
                        }}
                    >
                        <FiFileText size={14} style={{ marginRight: 8 }} /> PDF
                    </button>
                </div>
            )}
        </div>
    </div>
</div>

            {preview && previewData && (
                <div className="modal-overlay" onClick={fecharPreview}>
                    <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Prévia - {previewData.titulo}</h3>
                            <button className="modal-close" onClick={fecharPreview}>
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted" style={{ marginBottom: 12 }}>
                                Mostrando os 5 primeiros registros de {previewData.total}
                            </p>
                            <div className="table-responsive">
                                <table>
                                    <thead>
                                        <tr>
                                            {previewData.cabecalho.map(col => (
                                                <th key={col}>{col}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {previewData.dados.map((row, idx) => (
                                            <tr key={idx}>
                                                {row.map((cell, i) => (
                                                    <td key={i}>{cell}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={fecharPreview}>Fechar</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Relatorios;