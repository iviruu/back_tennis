import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';


dotenv.config();

// Seleccionar URL de base de datos según el entorno
const dbUrl = process.env.NODE_ENV === 'production' 
  ? process.env.DATABASE_URL_PROD 
  : process.env.DATABASE_URL;

// Configuración de la conexión
const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  dialectOptions: process.env.NODE_ENV === 'production' ? {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 60000
  } : {
    connectTimeout: 60000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 60000,
    idle: 10000
  },
  retry: {
    max: 3,
    timeout: 60000
  },
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  logging: false // Desactivar logs SQL
});

const syncroModel = async () => {
  try {
    // Sincronizar el modelo con la base de datos (crear la tabla si no existe)
    // Con "alter: true" se sincronizan las columnas y se crean/eliminan si fuera necesario
    await sequelize.sync({ force: false }).then(() => {
      console.log('Modelos sincronizado con la base de datos');
    }); 
  } catch (error) {
    console.error('Error al sincronizar los modelos:', error);
  }
};
  
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await syncroModel();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    // Intentar reconectar después de un tiempo si falla
    if (error.name === 'SequelizeConnectionError') {
      console.log('Retrying connection in 5 seconds...');
      setTimeout(testConnection, 5000);
    }
  }
};

export { sequelize, testConnection };

