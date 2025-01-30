import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Validar que DATABASE_URL existe
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 30000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: false,
  retry: {
    max: 3, // Número máximo de intentos de reconexión
    timeout: 3000 // Tiempo entre intentos en milisegundos
  }
});

const syncroModel = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('Error al sincronizar los modelos:', error.message);
    throw error;
  }
};
  
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión establecida exitosamente.');
    await syncroModel();
  } catch (error) {
    console.error('Error de conexión a la base de datos:', {
      message: error.message,
      code: error.parent?.code,
      hostname: error.parent?.hostname,
      url: process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@') // Oculta la contraseña al mostrar la URL
    });
    
    if (error.parent?.code === 'ENOTFOUND') {
      console.error('No se puede resolver el nombre del host. Por favor, verifica:');
      console.error('1. La URL de la base de datos en el archivo .env');
      console.error('2. Que el host especificado sea correcto y esté accesible');
      console.error('3. La configuración de red y firewall');
    }
    
    throw error;
  }
};

export { sequelize, testConnection };

