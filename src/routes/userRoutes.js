// src/routes/userRoutes.js
import { Router } from 'express';
import { getUser, updateUser, uploadPhoto } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authenticateToken.js';
import { uploadFileMiddleware } from '../middlewares/upload.js';
import { getSaques, getResultados, getResultadosByIdSaque, createResultados, getResultadosByIdAlumno, postResultadosSaqueAlumno } from '../controllers/resultadosController.js';
import { createRelacionAlumnoProfesor, getAlumnosByProfesor, getAlumnosList, getRelacion, updateRelacion } from '../controllers/teachercontroller.js';


const router = Router();

// Rutas para obtener y modificar los datos de los usuarios
router.get('/', authenticateToken([2,1]), getUser);
router.post("/upload-photo", authenticateToken([1,2]), uploadFileMiddleware, uploadPhoto);
router.get('/saque', authenticateToken([2,1]), getSaques);
router.get('/resultados', authenticateToken([2,1]), getResultados);
router.get('/resultados/saque/:id', authenticateToken([2,1]), getResultadosByIdSaque);
router.post('/create', authenticateToken([2,1]), createResultados);
router.get('/resultados/alumno/:id', authenticateToken([2,1]), getResultadosByIdAlumno);
router.post('/resultados/solo', authenticateToken([2,1]), postResultadosSaqueAlumno);
router.post('/teacher/create', authenticateToken([2,1]), createRelacionAlumnoProfesor);
router.get('/teacher/alumnos/:teacher_id', authenticateToken([2,1]), getAlumnosByProfesor);
router.get('/teacher/alumnosList', authenticateToken([2,1]), getAlumnosList);
router.get('/alumno/relacion/:alumno_id', authenticateToken([2,1]), getRelacion);
router.post('/alumno/update_relacion/:relacion_id', authenticateToken([2,1]), updateRelacion);
router.post('/updateUser', authenticateToken([2,1]), updateUser);
router.post('/uploadPhoto', authenticateToken([2,1]), uploadFileMiddleware, uploadPhoto);

export default router;
