const dotenv = require('dotenv');
dotenv.config();

const app = require('./src/app');

module.exports = app;

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
    });
}