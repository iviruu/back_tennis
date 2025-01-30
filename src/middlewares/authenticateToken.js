// src/middlewares/authenticateToken.js
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

export const authenticateToken = (allowedRoles) => async (req, res, next) => {
  try {
    console.log('----------------------------------------');
    console.log('Auth Middleware - Cookies:', req.cookies);
    
    const accessToken = req.cookies.token;

    if (!accessToken) {
      console.log('Auth Middleware - No token found in cookies');
      return res.status(401).json({
        code: -50,
        message: 'No se ha proporcionado un token de acceso'
      });
    }

    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      console.log('Auth Middleware - Decoded token:', decodedToken);
      
      const user = await User.findByPk(decodedToken.id_user);
      if (!user) {
        console.log('Auth Middleware - No user found for token');
        return res.status(401).json({
          code: -70,
          message: 'Token de acceso no válido'
        });
      }

      console.log('Auth Middleware - User roles:', user.roles);
      console.log('Auth Middleware - Allowed roles:', allowedRoles);
      
      const hasPermission = allowedRoles.includes(Number(user.roles));
      if (!hasPermission) {
        console.log('Auth Middleware - Permission denied');
        return res.status(403).json({
          code: -10,
          message: 'No tiene los permisos necesarios.'
        });
      }

      req.user = user;
      console.log('Auth Middleware - Authentication successful');
      console.log('----------------------------------------');
      next();
    } catch (jwtError) {
      console.log('Auth Middleware - JWT verification failed:', jwtError.message);
      return res.status(401).json({
        code: -60,
        message: 'Token de acceso inválido o expirado'
      });
    }
  } catch (error) {
    console.error('Auth Middleware - Unexpected error:', error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al autenticar el token de acceso'
    });
  }
};