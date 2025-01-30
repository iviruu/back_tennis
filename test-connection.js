import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function testDBConnection() {
  try {
    const connection = await mysql.createConnection(process.env.RAILWAY_PRIVATE_DOMAIN);

    console.log('Conexión exitosa!');
    await connection.end();
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

testDBConnection(); 