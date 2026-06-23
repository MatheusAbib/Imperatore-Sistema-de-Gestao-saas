import React from 'react';
import { 
    FiGithub, FiLinkedin, FiMail, FiInfo, FiCalendar, FiUser, 
    FiServer, FiMessageCircle, FiBookOpen, FiUsers, FiPackage, 
    FiBox, FiClipboard, FiShoppingBag, FiTrendingUp, FiCoffee, 
    FiGrid, FiFileText, FiBell, FiLogOut, FiBarChart2, FiDollarSign,
    FiUserCheck, FiRefreshCw, FiPlusCircle, FiEdit2, FiTrash2
} from 'react-icons/fi';

function Sobre() {
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
                        <p>Sistema de Gestão</p>
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
                        <div><strong>Ano de lançamento:</strong> 2026</div>
                    </div>
                </div>

                <div className="card">
                    <h3>
                        <FiUser size={18} color="var(--primary)" />
                        Contato com o Administrador
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
                        <div>
                            <FiGithub size={16} color="var(--text-muted)" />
                            <a href="https://github.com/MatheusAbib" target="_blank" rel="noopener noreferrer">
                                GitHub
                            </a>
                        </div>
                        <div>
                            <FiLinkedin size={16} color="var(--text-muted)" />
                            <a href="https://www.linkedin.com/in/matheusabib/" target="_blank" rel="noopener noreferrer">
                                LinkedIn
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
                        O Imperatore foi projetado para organizar todo o fluxo de um restaurante, bar ou café, desde a criação do cardápio até a entrega do pedido na mesa. 
                        O sistema conecta quatro áreas principais: <strong>Gestão</strong> (Dono e Gerente), <strong>Salão</strong> (Atendente), <strong>Cozinha</strong> e <strong>Administração</strong> (Admin).
                    </p>
                </div>

                <div className="sobre-grid-cards">
                    <div className="sobre-card">
                        <div>
                            <FiCoffee size={22} color="#b85a3a" />
                            <h4>1. Cadastro do Cardápio (Dono / Gerente)</h4>
                        </div>
                        <p>
                            O processo começa com o cadastro dos <strong>ingredientes</strong>. Cada ingrediente tem nome, unidade de compra, custo e <strong>fator de conversão</strong> 
                            (ex: 1kg de carne = 10 porções). O sistema calcula automaticamente o custo por unidade de uso.
                            Depois, o <strong>produto</strong> é criado com nome, preço de venda e categoria. Em seguida, é montada a ficha técnica: 
                            você associa os ingredientes ao produto com as quantidades necessárias. 
                            O sistema calcula automaticamente o custo total, a margem de lucro e o lucro em reais de cada produto.
                        </p>
                        <div className="sobre-exemplo">
                            Exemplo: X-Burger = Pão (1un) + Carne (1 porção) + Queijo (2 fatias) → Custo R$ 6,25 → Margem 75% → Lucro R$ 18,75
                        </div>
                    </div>

                    <div className="sobre-card">
                        <div>
                            <FiBox size={22} color="#5a7a8c" />
                            <h4>2. Controle de Estoque (Lotes)</h4>
                        </div>
                        <p>
                            O sistema gerencia o estoque por <strong>lotes</strong>. Cada lote registra a quantidade, data de validade e um identificador.
                            O dono ou gerente pode registrar múltiplos lotes do mesmo ingrediente com datas diferentes.
                            Os lotes próximos do vencimento são destacados em cores: <span style={{ color: '#dc3545' }}>vermelho (vencido)</span>, 
                            <span style={{ color: '#ffc107' }}> amarelo (vence hoje)</span>, 
                            <span style={{ color: '#fd7e14' }}> laranja (vence em até 7 dias)</span> e 
                            <span style={{ color: '#28a745' }}> verde (dentro da validade)</span>.
                        </p>
                    </div>
                </div>

                <div className="sobre-grid-cards">
                    <div className="sobre-card">
                        <div>
                            <FiClipboard size={22} color="#d4a84a" />
                            <h4>3. Comandas e Pedidos (Atendente)</h4>
                        </div>
                        <p>
                            O atendente abre uma <strong>comanda</strong> para uma mesa ou cliente, seleciona os produtos do cardápio, 
                            define a quantidade e adiciona observações (ex: "sem cebola", "bem passado").
                            Cada item da comanda tem um <strong>status</strong> que acompanha todo o processo: 
                            <strong> pendente → em preparo → pronto → entregue</strong>.
                            O atendente também pode remover itens ou fechar a comanda, que é automaticamente excluída após 2 horas.
                        </p>
                    </div>

                    <div className="sobre-card">
                        <div>
                            <FiShoppingBag size={22} color="#17a2b8" />
                            <h4>4. Painel da Cozinha (Cozinha)</h4>
                        </div>
                        <p>
                            A cozinha recebe os pedidos em <strong>tempo real</strong> (atualização a cada 5 segundos). 
                            Os pedidos são organizados em três colunas: <strong>Pendentes, Em preparo e Prontos</strong>.
                            O cozinheiro inicia o preparo, marca como pronto e, se o pedido ficar pronto por mais de 5 minutos,
                            um botão de notificação aparece para avisar o atendente. 
                            A ordem de exibição é dos pedidos mais recentes para os mais antigos.
                        </p>
                    </div>
                </div>

                <div className="sobre-grid-cards">
<div className="sobre-card">
    <div>
        <FiTrendingUp size={22} color="#6b8c4a" />
        <h4>5. Dashboard, Análise de Vendas e Relatórios (Dono / Gerente)</h4>
    </div>
    <p>
        O dono e gerente têm acesso a ferramentas completas para análise e gestão do negócio:
        <br /><br />
        <FiGrid size={16} style={{ marginRight: 6, color: 'var(--primary)' }} />
        <strong>Painel de Controle:</strong> visão geral com gráficos de distribuição de margens, top 10 produtos mais rentáveis e alertas de validade.<br />
        <FiBarChart2 size={16} style={{ marginRight: 6, color: 'var(--blue)' }} />
        <strong>Análise de Vendas:</strong> ranking de produtos mais vendidos e mais lucrativos, distribuição do faturamento, resumo geral (faturamento total, lucro total, margem geral) e identificação de produtos sem venda.<br />
        <FiDollarSign size={16} style={{ marginRight: 6, color: 'var(--yellow)' }} />
        <strong>Sugestões de preço:</strong> o sistema sugere novos preços para produtos com margem abaixo de 50%.<br />
        <FiCalendar size={16} style={{ marginRight: 6, color: 'var(--orange)' }} />
        <strong>Alertas de validade:</strong> produtos vencidos, vencendo hoje ou nos próximos 7 dias.<br />
        <FiFileText size={16} style={{ marginRight: 6, color: 'var(--green)' }} />
        <strong>Relatórios:</strong> exporte dados em Excel ou PDF de produtos, ingredientes, lotes, análise de vendas e relatório completo com todos os dados.<br />
        <br />
        <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
            Os dados da análise de vendas são calculados com base no preço registrado no momento da venda, 
            garantindo que alterações futuras no preço não distorçam o histórico.
        </span>
    </p>
</div>

                    <div className="sobre-card">
                        <div>
                            <FiUsers size={22} color="#8a6b8c" />
                            <h4>6. Perfis e Permissões</h4>
                        </div>
                        <p>
                            O Imperatore possui cinco perfis de acesso, cada um com funções específicas:
                            <br /><br />
                            <FiUserCheck size={16} style={{ marginRight: 6, color: '#b85a3a' }} />
                            <strong>Admin:</strong> visão completa do sistema, gerencia estabelecimentos, usuários e logs de ações.<br />
                            <FiUser size={16} style={{ marginRight: 6, color: '#28a745' }} />
                            <strong>Dono:</strong> gestão total do seu estabelecimento (produtos, ingredientes, estoque, usuários, relatórios).<br />
                            <FiUsers size={16} style={{ marginRight: 6, color: '#007bff' }} />
                            <strong>Gerente:</strong> gestão operacional (produtos, ingredientes, estoque, relatórios, comandas).<br />
                            <FiCoffee size={16} style={{ marginRight: 6, color: '#fd7e14' }} />
                            <strong>Atendente:</strong> criação de comandas, pedidos e gerenciamento de mesas.<br />
                            <FiShoppingBag size={16} style={{ marginRight: 6, color: '#17a2b8' }} />
                            <strong>Cozinha:</strong> visualização e atualização de status dos pedidos.
                        </p>
                    </div>
                </div>
            <div className="sobre-grid-cards">
                <div className="sobre-card">
                    <div>
                        <FiFileText size={22} color="#b85a3a" />
                        <h4>7. Logs de Ações (Admin, Dono e Gerente)</h4>
                    </div>
                    <p>
                        O sistema registra <strong>todas as ações</strong> realizadas pelos usuários, criando um histórico completo de atividades.
                        <br /><br />
                        <FiPlusCircle size={14} style={{ marginRight: 4, color: 'var(--green)' }} />
                        <strong>Criação:</strong> novos produtos, ingredientes, lotes, comandas e usuários.<br />
                        <FiEdit2 size={14} style={{ marginRight: 4, color: 'var(--yellow)' }} />
                        <strong>Edição:</strong> alterações em produtos, ingredientes, estabelecimentos e perfis.<br />
                        <FiTrash2 size={14} style={{ marginRight: 4, color: 'var(--red)' }} />
                        <strong>Exclusão:</strong> remoção de produtos, ingredientes, lotes e usuários.<br />
                        <FiRefreshCw size={14} style={{ marginRight: 4, color: 'var(--blue)' }} />
                        <strong>Status:</strong> mudanças de status em pedidos (preparo, pronto, entregue).<br />
                        <FiLogOut size={14} style={{ marginRight: 4, color: 'var(--orange)' }} />
                        <strong>Login:</strong> registro de entrada de usuários no sistema.
                        <br /><br />
                        <strong>Admin</strong> vê logs de todos os estabelecimentos.<br />
                        <strong>Dono e Gerente</strong> vêem apenas os logs do seu próprio estabelecimento.
                    </p>
                </div>

                <div className="sobre-card">
                    <div>
                        <FiBox size={22} color="#5a7a8c" />
                        <h4>8. Conversão de Unidades (Ingredientes)</h4>
                    </div>
                    <p>
                        Para calcular o custo correto de cada ingrediente no produto, o sistema utiliza um <strong>fator de conversão</strong>:
                        <br /><br />
                        <strong>Como funciona:</strong>
                        <br />
                        1. Você cadastra a <strong>unidade de compra</strong> (kg, L, pacote, caixa) e o custo.<br />
                        2. Você define quantas <strong>unidades de uso</strong> (porção, unidade, g, ml) têm em 1 unidade de compra.<br />
                        3. O sistema calcula automaticamente o <strong>custo por unidade de uso</strong>.
                        <br /><br />
                        <strong>Exemplo:</strong>
                        <br />
                        • 1kg de carne = R$ 29,00 → 10 porções → R$ 2,90 por porção<br />
                        • 1 pacote de pão = R$ 8,00 → 12 unidades → R$ 0,67 por unidade<br />
                        • 1 L de leite = R$ 5,00 → 1000 ml → R$ 0,005 por ml
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