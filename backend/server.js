const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');

const PORT = process.env.PORT || 3000;

console.log('DB_HOST carregado:', process.env.DB_HOST);
console.log('DB_NAME carregado:', process.env.DB_NAME);

module.exports = app;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}