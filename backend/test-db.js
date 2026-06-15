require('dotenv').config();
const mysql = require('mysql2');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar:', err.message);
    } else {
        console.log('Conectado ao banco com sucesso!');
        connection.query('SELECT 1 + 1 AS resultado', (err, results) => {
            if (err) {
                console.error('Erro na query:', err);
            } else {
                console.log('Query funcionou:', results);
            }
            connection.end();
        });
    }
});