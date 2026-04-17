const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDb() {
  let connection;
  try {
    // Connect without specifying a database to create it if it doesn't exist
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected to MySQL. Creating database and tables...');

    // Read the schema.sql file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf-8');

    // Execute the schema statements
    await connection.query(sql);

    console.log('Database and tables initialized successfully!');
  } catch (err) {
    console.error('Error initializing database:');
    console.error(err);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

initDb();
