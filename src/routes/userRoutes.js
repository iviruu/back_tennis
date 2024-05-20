// src/routes/userRoutes.js
import { Router } from 'express';
import { getUser, uploadPhoto } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';
import { getSaques, getResultados, getResultadosByIdSaque, createResultados } from '../controllers/resultadosController.js';


const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', authenticateToken([2,1]), getUser);
router.post("/upload-photo", authenticateToken([1,2]), uploadFileMiddleware, uploadPhoto);
router.post('/saque', authenticateToken([2,1]), getSaques);
router.post('/resultados', authenticateToken([2,1]), getResultados);
router.get('/resultados/:id', authenticateToken([2,1]), getResultadosByIdSaque);
router.post('/create', authenticateToken([2,1]), createResultados);

export default router;
