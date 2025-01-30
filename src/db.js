import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';


dotenv.config();

// Seleccionar URL de base de datos según el entorno
const dbUrl = process.env.NODE_ENV === 'production' 
  ? process.env.DATABASE_URL_PROD 
  : process.env.DATABASE_URL;

console.log('Ambiente:', process.env.NODE_ENV);
console.log('Intentando conectar a:', dbUrl.replace(/:[^:]*@/, ':****@')); // Oculta la contraseña en los logs

// Configuración de la conexión
const sequelize = new Sequelize(dbUrl, {
  dialect: 'mysql',
  dialectOptions: {
    connectTimeout: 30000,
    // SSL solo para producción
    ...(process.env.NODE_ENV === 'production' && {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    })
  },
  pool: {
    max: 2,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: console.log // Activar logs SQL temporalmente para debug
});

const syncroModel = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Modelos sincronizados con la base de datos');
  } catch (error) {
    console.error('Error al sincronizar los modelos:', error);
    throw error; // Propagar el error
  }
};
  
const testConnection = async () => {
  let retries = 3;
  
  while (retries > 0) {
    try {
      console.log(`Intento de conexión ${4 - retries}/3`);
      await sequelize.authenticate();
      console.log('Conexión establecida exitosamente.');
      await syncroModel();
      return true;
    } catch (error) {
      retries--;
      console.error('Error de conexión:', error.message);
      
      if (retries > 0) {
        console.log(`Reintentando en 5 segundos... ${retries} intentos restantes`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('Todos los intentos de conexión fallaron');
        throw error;
      }
    }
  }
};

export { sequelize, testConnection };

