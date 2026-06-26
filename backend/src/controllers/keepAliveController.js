const pool = require('../config/database');

const keepAlive = async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ 
      status: 'ok', 
      message: 'Database is alive!',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro no keep-alive:', error.message);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message 
    });
  }
};

module.exports = { keepAlive };