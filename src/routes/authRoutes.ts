import { Router, Request, Response } from 'express';
import { LoginRequest, LoginResponse } from '../types/user';
import { db } from '../database/database';
import logger from '../config/logger';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticación]
 *     summary: Iniciar sesión
 *     description: Autentica un usuario con email y contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: "juan@example.com"
 *             password: "123456"
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               message: "Login exitoso"
 *               user:
 *                 id: 1
 *                 name: "Juan Pérez"
 *                 email: "juan@example.com"
 *                 createdAt: "2025-08-01T10:00:00.000Z"
 *               token: "token_1_1234567890"
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Email y password son requeridos"
 *       401:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Credenciales inválidas"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /auth/login - Iniciar sesión
router.post('/login', async (req: Request<{}, LoginResponse, LoginRequest>, res: Response<LoginResponse>) => {
  try {
    const { email, password } = req.body;
    
    // Validación básica
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      });
    }
    
    // Buscar usuario por email (incluye la contraseña para verificación)
    const user = await db.getUserByEmail(email);
    
    if (!user) {
      logger.warn('Intento de login fallido - usuario no encontrado', {
        email,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Verificar contraseña (en producción usarías bcrypt para comparar hashes)
    if (user.password !== password) {
      logger.warn('Intento de login fallido - contraseña incorrecta', {
        email,
        userId: user.id,
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent')
      });
      
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }
    
    // Generar token simple (en producción usarías JWT)
    const token = `token_${user.id}_${Date.now()}`;
    
    // Usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;
    
    logger.info('Login exitoso', {
      userId: user.id,
      userName: user.name,
      email: user.email,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    logger.error('Error en login', {
      email: req.body.email,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      ip: req.ip || req.connection.remoteAddress
    });
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags: [Autenticación]
 *     summary: Cerrar sesión
 *     description: Cierra la sesión del usuario (placeholder)
 *     responses:
 *       200:
 *         description: Logout exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: true
 *               message: "Logout exitoso"
 */
// POST /api/auth/logout - Logout de usuario (placeholder)
router.post('/logout', (req: Request, res: Response) => {
  // En una aplicación real, aquí invalidarías el token
  res.json({
    success: true,
    message: 'Logout exitoso'
  });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags: [Autenticación]
 *     summary: Obtener información del usuario actual
 *     description: Retorna la información del usuario autenticado
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario encontrado"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autorización requerido o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Token de autorización requerido"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /api/auth/me - Obtener información del usuario actual (placeholder)
router.get('/me', async (req: Request, res: Response) => {
  try {
    // En una aplicación real, aquí verificarías el token del header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido'
      });
    }
    
    // Simulación simple de verificación de token
    if (!authHeader.startsWith('Bearer token_')) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    // Extraer ID del token simulado
    const tokenParts = authHeader.replace('Bearer ', '').split('_');
    const userId = parseInt(tokenParts[1]);
    
    if (isNaN(userId)) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    const user = await db.getUserById(userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error en /me:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;
