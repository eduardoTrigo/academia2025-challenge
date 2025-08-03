import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import { setupSwagger } from './config/swagger';
import logger from './config/logger';
import { httpLogger, errorLogger } from './middleware/logging';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware de logging (debe ir antes de otros middlewares)
app.use(httpLogger);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Swagger
setupSwagger(app);

// Log de inicio de aplicación
logger.info('Iniciando servidor Express', {
  port: PORT,
  environment: process.env.NODE_ENV || 'development',
  timestamp: new Date().toISOString()
});

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Información General]
 *     summary: Información de la API
 *     description: Retorna información general sobre la API y sus endpoints disponibles
 *     responses:
 *       200:
 *         description: Información de la API
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bienvenido a la API de Express.js con TypeScript"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 *                 authentication:
 *                   type: object
 *                 endpoints:
 *                   type: object
 */
// GET / - Ruta raíz
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Bienvenido a la API de Express.js con TypeScript',
    version: '1.0.0',
    authentication: {
      required: 'Los endpoints de usuarios requieren autenticación',
      process: [
        '1. POST /api/auth/login con email y password',
        '2. Usar el token recibido en el header Authorization: Bearer <token>',
        '3. Acceder a los endpoints protegidos de /api/users'
      ]
    },
    endpoints: {
      auth: {
        'POST /api/auth/login': 'Iniciar sesión (público)',
        'POST /api/auth/logout': 'Cerrar sesión (público)',
        'GET /api/auth/me': 'Obtener información del usuario actual (requiere auth)'
      },
      users: {
        'GET /api/users': 'Obtener todos los usuarios (🔒 requiere auth)',
        'GET /api/users/:id': 'Obtener usuario por ID (🔒 requiere auth)',
        'POST /api/users': 'Crear nuevo usuario (🔒 requiere auth)',
        'PUT /api/users/:id': 'Actualizar usuario (🔒 requiere auth)',
        'DELETE /api/users/:id': 'Eliminar usuario (🔒 requiere auth)'
      },
      products: {
        'GET /api/products': 'Obtener todos los productos (🔒 requiere auth, soporta ?category=X&search=Y&active=true)',
        'GET /api/products/:id': 'Obtener producto por ID (🔒 requiere auth)',
        'POST /api/products': 'Crear nuevo producto (🔒 requiere auth)',
        'PUT /api/products/:id': 'Actualizar producto (🔒 requiere auth)',
        'PATCH /api/products/:id/stock': 'Actualizar stock del producto (🔒 requiere auth)',
        'DELETE /api/products/:id': 'Eliminar producto (🔒 requiere auth)'
      }
    }
  });
});

// Middleware para manejar rutas no encontradas
app.use('*', (req: Request, res: Response) => {
  logger.warn('Endpoint no encontrado', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress
  });
  
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado'
  });
});

// Middleware de logging de errores (debe ir antes del error handler)
app.use(errorLogger);

// Middleware global para manejo de errores
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Error no manejado en la aplicación', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress
  });
  
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info('Servidor iniciado exitosamente', {
    port: PORT,
    apiDocs: `http://localhost:${PORT}/api-docs`,
    environment: process.env.NODE_ENV || 'development'
  });
  
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 API Documentation disponible en http://localhost:${PORT}/api-docs`);
});

export default app;
