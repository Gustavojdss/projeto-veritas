require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  // AQUI ESTAVA O ERRO: Antes estava fixo 'localhost' ou '127.0.0.1'
  // Agora ele vai ler a variável que configuramos no Railway:
  host: process.env.DB_HOST, 
  
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
