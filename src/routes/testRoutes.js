// src/routes/userRoutes.js
import { Router } from 'express';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { allAccess, userBoard, moderatorBoard, adminBoard } from '../controllers/testController.js';

const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/all', allAccess);
router.get('/user', authenticateToken([2,1]), userBoard);
router.get('/mod', authenticateToken([2,1]), moderatorBoard);
router.get('/admin', authenticateToken([2,1]), adminBoard);

export default router;