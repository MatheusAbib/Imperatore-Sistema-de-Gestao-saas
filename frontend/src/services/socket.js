import api from './api';

let intervalId = null;
let callbacks = [];

export function iniciarMonitoramentoPedidos(usuarioId, onNotificacao) {
    if (intervalId) return;
    
    let ultimoStatus = {};
    
    intervalId = setInterval(async () => {
        try {
            const response = await api.get('/pedidos/notificacoes');
            const pedidos = response.data;
            
            pedidos.forEach(pedido => {
                if (ultimoStatus[pedido.id] !== pedido.status) {
                    ultimoStatus[pedido.id] = pedido.status;
                    if (pedido.status === 'pronto') {
                        onNotificacao({
                            mensagem: `Pedido da Mesa ${pedido.numero_mesa} - ${pedido.produto_nome} está pronto!`,
                            pedido
                        });
                    }
                }
            });
        } catch (error) {
            console.error('Erro ao buscar notificacoes', error);
        }
    }, 5000);
}

export function pararMonitoramento() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
}