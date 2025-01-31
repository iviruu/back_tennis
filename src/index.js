// app.js
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors'; //para poder hacer puts, y tal desde el cliente al servidor
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import testRoutes from './routes/testRoutes.js';
import { testConnection } from './db.js';
import dotenv from 'dotenv';
import path from 'path';
import { insertInitialUserData } from './start_data.js';






dotenv.config();

const app = express();

const corsOptions = {
  credentials: true,
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://tenis-progress.netlify.app'
    : 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'Cookie', 
    'Accept',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));


//header and populate req.cookies with an object keyed by the cookie names
app.use(cookieParser());

// Middleware para analizar el cuerpo de las solicitudes con formato JSON
app.use(express.json());

// Middleware para analizar el cuerpo de las solicitudes con datos de formulario
app.use(express.urlencoded({ extended: true })); // Para analizar datos de formularios en el cuerpo de la solicitud

// Middleware para logging mejorado
app.use((req, res, next) => {
  console.log('----------------------------------------');
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log('Cookies recibidas:', req.cookies);
  console.log('Token en cookies:', req.cookies.token);
  console.log('Authorization Header:', req.headers.authorization);
  console.log('Origin:', req.headers.origin);
  console.log('Host:', req.headers.host);
  console.log('All Headers:', JSON.stringify(req.headers, null, 2));
  console.log('----------------------------------------');
  next();
});

await testConnection();
await insertInitialUserData();

// Configurar rutas
app.use('/auth', authRoutes);

app.use('/user', (req, res, next) => {
  console.log('----------------------------------------');
  console.log('User Route - Token en cookies:', req.cookies.token);
  console.log('User Route - Headers:', req.headers);
  console.log('User Route - URL:', req.url);
  console.log('----------------------------------------');
  next();
});

app.use('/user', userRoutes);

app.use('/test', testRoutes);

// Configura Express para servir archivos estáticos desde el directorio 'uploads'
const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'src/uploads')));

// Iniciar el servidor
app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});
