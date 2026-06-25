import React, { useState, useEffect } from 'react';
import { 
    FiGithub, FiLinkedin, FiMail, FiInfo, FiCalendar, FiUser, 
    FiMessageCircle, FiBookOpen, FiUsers, FiPackage, 
    FiBox, FiClipboard, FiShoppingBag, FiTrendingUp, FiCoffee, 
    FiGrid, FiFileText, FiBarChart2, FiDollarSign,
    FiUserCheck, FiRefreshCw, FiPlusCircle, FiEdit2, FiTrash2
} from 'react-icons/fi';

function Sobre() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => setLoading(false), 500);
    }, []);

    if (loading) {
        return (
            <div className="skeleton-container">
                <div className="page-header">
                    <div>
                        <h1>Sobre</h1>
                        <p className="text-muted">Informações sobre o sistema Imperatore</p>
                    </div>
                </div>
                <div className="skeleton-card" style={{ height: 120, minHeight: 120 }}></div>
                <div className="sobre-grid">
                    <div className="skeleton-card" style={{ height: 150, minHeight: 150 }}></div>
                    <div className="skeleton-card" style={{ height: 150, minHeight: 150 }}></div>
                </div>
                <div className="skeleton-card" style={{ height: 400, minHeight: 400 }}></div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <div className="page-header">
                <div>
                    <h1>Sobre</h1>
                    <p className="text-muted">Informações sobre o sistema Imperatore</p>
                </div>
            </div>

            <div className="card sobre-card-header">
                <div className="sobre-header">
                    <img src="/crown.png" alt="Imperatore" />
                    <div>
                        <h2>Imperatore</h2>
                        <p>Sistema de Gestão para Restaurantes, Bares e Cafés</p>
                    </div>
                </div>
                <p className="sobre-descricao">
                    Sistema completo para gestão de restaurantes, bares e cafés. 
                    Gerencie produtos, ingredientes, estoque, comandas e pedidos em um único lugar.
                </p>
            </div>

            <div className="sobre-grid">
                <div className="card">
                    <h3>
                        <FiInfo size={18} color="var(--primary)" />
                        Informações do Sistema
                    </h3>
                    <div className="sobre-info-item">
                        <div><strong>Versão:</strong> 1.0.0</div>
                        <div><strong>Desenvolvido por:</strong> Matheus Bilítardo Abib</div>
                        <div><strong>Ano:</strong> 2026</div>
                    </div>
                </div>

                <div className="card">
                    <h3>
                        <FiUser size={18} color="var(--primary)" />
                        Contato
                    </h3>
                    <div className="sobre-info-item">
                        <div>
                            <FiMail size={16} color="var(--text-muted)" />
                            <a href="mailto:matheus.abib.ma@gmail.com">
                                matheus.abib.ma@gmail.com
                            </a>
                        </div>
                        <div>
                            <FiMessageCircle size={16} color="var(--text-muted)" />
                            <a href="https://wa.me/5511975072008" target="_blank" rel="noopener noreferrer">
                                (11) 97507-2008
                            </a>
                        </div>
                        <div style={{ display: 'flex', gap: 16, marginTop: 4 }}>
                            <a href="https://github.com/MatheusAbib" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                                <FiGithub size={16} /> GitHub
                            </a>
                            <a href="https://www.linkedin.com/in/matheusabib/" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                                <FiLinkedin size={16} /> LinkedIn
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card sobre-fluxo">
                <h3>
                    <FiBookOpen size={18} color="var(--primary)" />
                    Como funciona o Imperatore?
                </h3>

      <div className="sobre-fluxo-texto">
    <h4>Fluxo completo do sistema</h4>
    <p>
        O Imperatore conecta três áreas principais dentro de cada estabelecimento: 
        <strong> Gestão</strong> (Dono e Gerente), <strong>Salão</strong> (Atendente) e <strong>Cozinha</strong>.
        Além disso, o <strong>Administrador</strong> (Matheus Abib) gerencia todos os estabelecimentos do sistema.
    </p>
</div>

                <div className="sobre-grid-cards">
                    <div className="sobre-card">
                        <div>
                            <FiCoffee size={20} color="#b85a3a" />
                            <h4>1. Cadastro do Cardápio</h4>
                        </div>
                        <p>
                            <strong>Ingredientes:</strong> cadastro com nome, unidade de compra, custo e <strong>fator de conversão</strong> 
                            (ex: 1kg de carne = 10 porções). O sistema calcula automaticamente o custo por unidade de uso.
                            <br /><br />
                            <strong>Produtos:</strong> criados com nome, preço de venda e categoria. Ficha técnica com ingredientes e quantidades. 
                            O sistema calcula automaticamente custo total, margem de lucro e lucro em reais.
                        </p>
                        <div className="sobre-exemplo">
                            Exemplo: X-Burger = Pão (1un) + Carne (1 porção) + Queijo (2 fatias) → Custo R$ 6,25 → Margem 75% → Lucro R$ 18,75
                        </div>
                    </div>

                    <div className="sobre-card">
                        <div>
                            <FiBox size={20} color="#5a7a8c" />
                            <h4>2. Controle de Estoque (Lotes)</h4>
                        </div>
                        <p>
                            Gestão de estoque por <strong>lotes</strong>, registrando quantidade, data de validade e identificador.
                            Múltiplos lotes do mesmo ingrediente com datas diferentes.
                            <br /><br />
                            <strong>Sistema de cores:</strong> 
                            <span style={{ color: '#dc3545' }}> vermelho (vencido)</span>, 
                            <span style={{ color: '#ffc107' }}> amarelo (vence hoje)</span>, 
                            <span style={{ color: '#fd7e14' }}> laranja (vence em até 7 dias)</span> e 
                            <span style={{ color: '#28a745' }}> verde (dentro da validade)</span>.
                        </p>
                    </div>
                </div>

                <div className="sobre-grid-cards">
                    <div className="sobre-card">
                        <div>
                            <FiClipboard size={20} color="#d4a84a" />
                            <h4>3. Comandas e Pedidos</h4>
                        </div>
                        <p>
                            O atendente abre uma <strong>comanda</strong> para uma mesa ou cliente, seleciona produtos do cardápio, 
                            define quantidade e adiciona observações (ex: "sem cebola", "bem passado").
                            <br /><br />
                            Cada item tem um <strong>status</strong> que acompanha todo o processo: 
                            <strong> pendente → em preparo → pronto → entregue</strong>.
                            O atendente pode remover itens ou fechar a comanda, que é automaticamente excluída após 2 horas.
                        </p>
                    </div>

                    <div className="sobre-card">
                        <div>
                            <FiShoppingBag size={20} color="#17a2b8" />
                            <h4>4. Painel da Cozinha</h4>
                        </div>
                        <p>
                            A cozinha recebe os pedidos em <strong>tempo real</strong> (atualização a cada 5 segundos).
                            Organizados em três colunas: <strong>Pendentes, Em preparo e Prontos</strong>.
                            <br /><br />
                            O cozinheiro inicia o preparo, marca como pronto e, se o pedido ficar pronto por mais de 5 minutos,
                            um alerta aparece para avisar o atendente. 
                            A ordem de exibição é dos pedidos mais recentes para os mais antigos.
                        </p>
                    </div>
                </div>

                <div className="sobre-grid-cards">
                    <div className="sobre-card">
                        <div>
                            <FiTrendingUp size={20} color="#6b8c4a" />
                            <h4>5. Dashboard, Análise de Vendas e Relatórios</h4>
                        </div>
                        <p>
                            <strong>Dashboard:</strong> gráficos de distribuição de margens, top 10 produtos mais rentáveis e alertas de validade.
                            <br /><br />
                            <strong>Análise de Vendas:</strong> ranking de produtos mais vendidos e mais lucrativos, distribuição do faturamento, 
                            resumo geral (faturamento total, lucro total, margem geral) e identificação de produtos sem venda.
                            <br /><br />
                            <strong>Sugestões de preço:</strong> o sistema sugere novos preços para produtos com margem abaixo de 50%.
                            <br /><br />
                            <strong>Relatórios:</strong> exportação em Excel ou PDF de produtos, ingredientes, lotes, análise de vendas e relatório completo.
                            <br /><br />
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                                Os dados da análise de vendas são calculados com base no preço registrado no momento da venda, 
                                garantindo que alterações futuras no preço não distorçam o histórico.
                            </span>
                        </p>
                    </div>

<div className="sobre-card">
    <div>
        <FiUsers size={20} color="#8a6b8c" />
        <h4>6. Perfis e Permissões</h4>
    </div>
    <p>
        <strong>Administrador (Matheus Abib):</strong> visão completa do sistema, gerencia todos os estabelecimentos, usuários e logs de ações.<br />
        <strong>Dono:</strong> gestão total do seu estabelecimento (produtos, ingredientes, estoque, usuários, relatórios).<br />
        <strong>Gerente:</strong> gestão operacional (produtos, ingredientes, estoque, relatórios, comandas).<br />
        <strong>Atendente:</strong> criação de comandas, pedidos e gerenciamento de mesas.<br />
        <strong>Cozinha:</strong> visualização e atualização de status dos pedidos.
    </p>
</div>
                </div>

                <div className="sobre-grid-cards">
                    <div className="sobre-card">
                        <div>
                            <FiFileText size={20} color="#b85a3a" />
                            <h4>7. Logs de Ações</h4>
                        </div>
                        <p>
                            O sistema registra <strong>todas as ações</strong> realizadas pelos usuários:
                            <br /><br />
                            <strong>Criação:</strong> novos produtos, ingredientes, lotes, comandas e usuários.<br />
                            <strong>Edição:</strong> alterações em produtos, ingredientes, estabelecimentos e perfis.<br />
                            <strong>Exclusão:</strong> remoção de produtos, ingredientes, lotes e usuários.<br />
                            <strong>Status:</strong> mudanças de status em pedidos (preparo, pronto, entregue).<br />
                            <strong>Login:</strong> registro de entrada de usuários no sistema.
                            <br /><br />
                            <strong>Admin</strong> vê logs de todos os estabelecimentos.<br />
                            <strong>Dono e Gerente</strong> vêem apenas os logs do seu próprio estabelecimento.
                        </p>
                    </div>

                    <div className="sobre-card">
                        <div>
                            <FiBox size={20} color="#5a7a8c" />
                            <h4>8. Conversão de Unidades</h4>
                        </div>
                        <p>
                            Para calcular o custo correto de cada ingrediente, o sistema utiliza um <strong>fator de conversão</strong>:
                            <br /><br />
                            1. Você cadastra a <strong>unidade de compra</strong> (kg, L, pacote, caixa) e o custo.<br />
                            2. Você define quantas <strong>unidades de uso</strong> (porção, unidade, g, ml) têm em 1 unidade de compra.<br />
                            3. O sistema calcula automaticamente o <strong>custo por unidade de uso</strong>.
                            <br /><br />
                            <strong>Exemplos:</strong><br />
                            • 1kg de carne = R$ 29,00 → 10 porções → R$ 2,90 por porção<br />
                            • 1 pacote de pão = R$ 8,00 → 12 unidades → R$ 0,67 por unidade
                            <br /><br />
                            <span className="sobre-destaque">
                                <FiInfo size={16} />
                                Isso garante que o custo de cada produto seja calculado com precisão!
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sobre;