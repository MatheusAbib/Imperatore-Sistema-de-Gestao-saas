require('dotenv').config();
const mysql = require('mysql2');
const fs = require('fs');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_NAME:', process.env.DB_NAME);

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: fs.readFileSync('./ca.pem'),
        rejectUnauthorized: true
    }
});

connection.connect((err) => {
    if (err) {
        console.error('❌ Erro:', err.message);
    } else {
        console.log('✅ Conectado!');
        connection.query('SELECT 1+1 AS resultado', (err, results) => {
            if (err) {
                console.error('❌ Query:', err);
            } else {
                console.log('✅ Query:', results);
            }
            connection.end();
        });
    }
});