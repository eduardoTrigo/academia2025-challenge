import { Request, Response, NextFunction } from 'express';
import { db } from '../database/database';

// Extender la interfaz Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name: string;
        email: string;
        created_at: string;
      };
    }
  }
}

// Middleware de autenticación
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Token de autorización requerido. Debes estar logueado para acceder a este recurso.'
      });
    }
    
    // Verificar formato del token
    if (!authHeader.startsWith('Bearer token_')) {
      return res.status(401).json({
        success: false,
        message: 'Formato de token inválido. Usa: Bearer token_usuario_timestamp'
      });
    }
    
    // Extraer y validar el token
    const token = authHeader.replace('Bearer ', '');
    const tokenParts = token.split('_');
    
    if (tokenParts.length !== 3 || tokenParts[0] !== 'token') {
      return res.status(401).json({
        success: false,
        message: 'Token malformado'
      });
    }
    
    const userId = parseInt(tokenParts[1]);
    const timestamp = parseInt(tokenParts[2]);
    
    if (isNaN(userId) || isNaN(timestamp)) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    // Verificar que el token no sea muy antiguo (opcional - 24 horas)
    const tokenAge = Date.now() - timestamp;
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    
    if (tokenAge > maxAge) {
      return res.status(401).json({
        success: false,
        message: 'Token expirado. Por favor, inicia sesión nuevamente.'
      });
    }
    
    // Verificar que el usuario existe
    const user = await db.getUserById(userId);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado. Token inválido.'
      });
    }
    
    // Agregar la información del usuario al request
    req.user = user;
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor durante la autenticación'
    });
  }
};

// Middleware opcional que permite acceso con o sin autenticación
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer token_')) {
      // Si hay token, intentar autenticar
      const token = authHeader.replace('Bearer ', '');
      const tokenParts = token.split('_');
      
      if (tokenParts.length === 3 && tokenParts[0] === 'token') {
        const userId = parseInt(tokenParts[1]);
        
        if (!isNaN(userId)) {
          const user = await db.getUserById(userId);
          if (user) {
            req.user = user;
          }
        }
      }
    }
    
    next();
  } catch (error) {
    console.error('Error en autenticación opcional:', error);
    next(); // Continuar sin autenticación en caso de error
  }
};
