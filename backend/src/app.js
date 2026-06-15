const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const produtoRoutes = require('./routes/produtoRoutes');
const ingredienteRoutes = require('./routes/ingredienteRoutes');
const validadeRoutes = require('./routes/validadeRoutes');
const comandaRoutes = require('./routes/comandaRoutes');
const loteRoutes = require('./routes/loteRoutes');


const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/ingredientes', ingredienteRoutes);
app.use('/api/validade', validadeRoutes);
app.use('/api', comandaRoutes);
app.use('/api/lotes', loteRoutes);



app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Servidor funcionando' });
});

module.exports = app;