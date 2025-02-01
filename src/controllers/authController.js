import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import RecoveryToken from '../models/recoveryTokenModel.js';
import { validationResult } from 'express-validator';
import { serialize } from 'cookie';
import { esPar, contraseniasCoinciden } from '../utils/utils.js';

const cookieOptions = {
  httpOnly: true,
  secure: true,  // Siempre true porque Netlify usa HTTPS
  sameSite: 'none',  // Necesario para cross-site
  maxAge: 30 * 24 * 60 * 60 * 1000,
  path: '/',
  // No establecer domain para permitir cross-domain cookies
  domain: undefined  // Quitamos el dominio fijo
};

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    const { email, password, name, surname, roles } = req.body;
    
    // Verificar usuario existente
    const existingUser = await User.findOne({ where: { email }});
    if (existingUser) {
      return res.status(400).json({
        code: -2,
        message: 'Ya existe un usuario con el mismo correo electrónico'
      });
    }

    // Crear usuario
    const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    const newUser = await User.create({ 
      email, 
      password: hashedPassword, 
      name, 
      surname, 
      roles, 
      status: 1 
    });

    // Generar token
    const accessToken = jwt.sign(
      { 
        id_user: newUser.id_user, 
        name: newUser.name,
        roles: Number(newUser.roles)
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Log para debugging
    console.log('----------------------------------------');
    console.log('Register - Generated token:', accessToken);
    console.log('Register - User data:', {
      id: newUser.id_user,
      name: newUser.name,
      roles: newUser.roles
    });
    console.log('----------------------------------------');

    // Enviar respuesta con token
    res.status(200).json({
      code: 1,
      message: 'Usuario registrado correctamente',
      data: {
        token: accessToken,
        user: {
          name: newUser.name,
          surname: newUser.surname,
          email: newUser.email,
          roles: String(newUser.roles)
        } 
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al registrar el usuario',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    
    // Verificar si el correo electrónico y la contraseña son correctos
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        code: -25,
        message: 'user No exist'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        code: -5,
        message: 'Credenciales incorrectas'
      });
    }

    // Generar un token de acceso y lo guardo en un token seguro (httpOnly)
    const accessToken = jwt.sign(
      { 
        id_user: user.id_user, 
        name: user.name,
        roles: Number(user.roles)
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Configuración específica de CORS para cookies
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' 
      ? 'https://tenis-progress.netlify.app'
      : 'http://localhost:4200'
    );

    // Log mejorado para debugging
    console.log('----------------------------------------');
    console.log('Login - Request Origin:', req.headers.origin);
    console.log('Login - Cookie options:', {
      ...cookieOptions,
      domain: process.env.NODE_ENV === 'production' ? '.up.railway.app' : 'localhost'
    });
    console.log('Login - Cookie string:', accessToken);
    console.log('Login - Response headers:', {
      'access-control-allow-credentials': res.getHeader('Access-Control-Allow-Credentials'),
      'access-control-allow-origin': res.getHeader('Access-Control-Allow-Origin'),
    });
    console.log('----------------------------------------');

    res.status(200).json({
      code: 1,
      message: 'Login OK',
      data: {
        token: accessToken,
        user: {
          name: user.name,
          surname: user.surname,
          email: user.email,
          roles: String(user.roles)
        } 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al iniciar sesión',
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        code: -8,
        message: 'Email does not exist'
      });
    }

    let resetToken = crypto.randomBytes(32).toString("hex");

    await new RecoveryToken({
      user_id: user.id_user,
      token: resetToken,
      created_at: Date.now(),
    }).save();

    // Retornar solo el token sin enviar email
    res.status(200).json({
      code: 100,
      message: 'Reset token generated successfully',
      data: {
        token: resetToken
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al procesar la solicitud',
      error: error
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);

    // If there are validation errors, respond with a 400 Bad Request status
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { token, password } = req.body;

    //Reviso si el Token existe
    let token_row = await RecoveryToken.findOne({ where: { token } });
    if (!token_row) {
      return res.status(404).json({
        code: -3,
        message: 'Token Incorrecto'
      });
    } 

    // Buscar un usuario por su ID en la base de datos
    const user = await User.findOne({ where: { id_user: token_row.user_id } });
    if (!user) {
      return res.status(404).json({
        code: -10,
        message: 'Usuario no encontrado'
      });
    }


    // Actualizar la contraseña del usuario
    user.password = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT));
    await user.save();
    //Elimino el token
    await RecoveryToken.destroy({
      where: {
        user_id: token_row.user_id
      }
    })

    const accessToken = jwt.sign(
      { 
        id_user: user.id_user, 
        name: user.name,
        roles: Number(user.roles)
      }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      code: 1,
      message: 'Password updated successfully',
      data: {
        token: accessToken,
        user: {
          name: user.name,
          surname: user.surname,
          email: user.email,
          roles: String(user.roles)
        } 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: -100,
      message: 'Ha ocurrido un error al actualizar el usuario',
      error: error
    });
  }
};

export const logout = async (req, res) => {
  res.status(200).json({
    code: 0,
    message: 'Logged out successfully'
  });
  // El frontend se encargará de eliminar el token del localStorage
};