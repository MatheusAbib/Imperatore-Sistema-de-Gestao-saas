const db = require('../config/database');

async function limparComandasFechadas() {
    try {
        const [result] = await db.execute(
            `DELETE FROM comandas 
             WHERE status = 'fechada' 
             AND updated_at < DATE_SUB(NOW(), INTERVAL 30 MINUTE)`
        );
        if (result.affectedRows > 0) {
            console.log(`🗑️ ${result.affectedRows} comandas fechadas removidas`);
        }
        return result.affectedRows;
    } catch (error) {
        console.error('Erro ao limpar comandas fechadas:', error);
        return 0;
    }
}

module.exports = { limparComandasFechadas };