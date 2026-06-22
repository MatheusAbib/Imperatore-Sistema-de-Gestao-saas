const db = require('../config/database');

class Lote {
    static async criar(loteData) {
        const { ingrediente_id, quantidade, data_validade, lote, estabelecimento_id, usuario_id } = loteData;
        
        const [result] = await db.execute(
            'INSERT INTO lotes (ingrediente_id, quantidade, data_validade, lote, estabelecimento_id) VALUES (?, ?, ?, ?, ?)',
            [ingrediente_id, quantidade, data_validade, lote || null, estabelecimento_id]
        );
        
        await db.execute(
            'INSERT INTO movimentos_estoque (lote_id, tipo, quantidade, motivo, usuario_id) VALUES (?, ?, ?, ?, ?)',
            [result.insertId, 'entrada', quantidade, 'Registro inicial', usuario_id]
        );
        
        return result.insertId;
    }

    static async buscarPorId(id, estabelecimento_id) {
        const [rows] = await db.execute(
            `SELECT l.*, i.nome as ingrediente_nome, i.unidade 
             FROM lotes l 
             JOIN ingredientes i ON l.ingrediente_id = i.id 
             WHERE l.id = ? AND l.estabelecimento_id = ?`,
            [id, estabelecimento_id]
        );
        return rows[0];
    }

    static async listarPorEstabelecimento(estabelecimento_id) {
        const [rows] = await db.execute(
            `SELECT l.*, i.nome as ingrediente_nome, i.unidade 
             FROM lotes l 
             JOIN ingredientes i ON l.ingrediente_id = i.id 
             WHERE l.estabelecimento_id = ? AND l.quantidade > 0
             ORDER BY l.data_validade ASC`,
            [estabelecimento_id]
        );
        return rows;
    }

    static async listarPorIngrediente(ingrediente_id, estabelecimento_id) {
        const [rows] = await db.execute(
            `SELECT * FROM lotes 
             WHERE ingrediente_id = ? AND estabelecimento_id = ? AND quantidade > 0
             ORDER BY data_validade ASC`,
            [ingrediente_id, estabelecimento_id]
        );
        return rows;
    }

    static async baixarEstoque(ingrediente_id, quantidade, usuario_id, estabelecimento_id) {
        const lotes = await this.listarPorIngrediente(ingrediente_id, estabelecimento_id);
        let quantidadeRestante = quantidade;
        
        for (const loteItem of lotes) {
            if (quantidadeRestante <= 0) break;
            
            const quantidadeBaixar = Math.min(loteItem.quantidade, quantidadeRestante);
            const novaQuantidade = loteItem.quantidade - quantidadeBaixar;
            
            await db.execute(
                'UPDATE lotes SET quantidade = ? WHERE id = ?',
                [novaQuantidade, loteItem.id]
            );
            
            await db.execute(
                'INSERT INTO movimentos_estoque (lote_id, tipo, quantidade, motivo, usuario_id) VALUES (?, ?, ?, ?, ?)',
                [loteItem.id, 'saida', quantidadeBaixar, 'Consumo', usuario_id]
            );
            
            quantidadeRestante -= quantidadeBaixar;
        }
        
        if (quantidadeRestante > 0) {
            throw new Error(`Estoque insuficiente para ingrediente ${ingrediente_id}`);
        }
    }

    static async deletar(id, estabelecimento_id) {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        try {
            await connection.execute(
                'DELETE FROM movimentos_estoque WHERE lote_id = ?',
                [id]
            );

            const [result] = await connection.execute(
                'DELETE FROM lotes WHERE id = ? AND estabelecimento_id = ?',
                [id, estabelecimento_id]
            );

            await connection.commit();
            connection.release();
            
            return result.affectedRows;
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
}

module.exports = Lote;