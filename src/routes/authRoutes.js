// src/routes/authRoutes.js
import { Router } from 'express';
import { register, login, logout, forgotPassword, changePassword } from '../controllers/authController.js';
import { registerValidator, loginValidator, forgotPasswordValidator, changePasswordValidator } from '../validations/auth.Validation.js'
import { authenticateToken } from '../middlewares/authenticateToken.js';

const router = Router();

// Rutas para registrarse e iniciar sesión
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);
router.post('/change-password', changePasswordValidator, changePassword);
router.get('/logout', logout);

// Ruta para verificar el token
router.get('/verify', authenticateToken([1,2]), (req, res) => {
  res.status(200).json({
    code: 1,
    message: 'Token válido',
    data: {
      user: {
        name: req.user.name,
        email: req.user.email,
        roles: req.user.roles
      }
    }
  });
});

export default router;
