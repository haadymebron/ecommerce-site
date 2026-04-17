const mysql = require('mysql2/promise');
require('dotenv').config();

async function alterDb() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ecommerce_db',
    });

    console.log('Connected to MySQL. Altering table...');

    // Add seller_id column to Products table if it doesn't exist
    // We catch errors just in case the column already exists
    try {
      await connection.query('ALTER TABLE Products ADD COLUMN seller_id INT, ADD FOREIGN KEY (seller_id) REFERENCES Users(id) ON DELETE CASCADE');
      console.log('Column seller_id added successfully.');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
         console.log('Column seller_id already exists. Skipping.');
      } else {
         throw e;
      }
    }

  } catch (error) {
    console.error('Failed to alter database:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
    process.exit();
  }
}

alterDb();
