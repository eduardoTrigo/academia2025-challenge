import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

// Extender la interfaz Request para incluir la información del usuario
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
}

// Middleware para logging de requests HTTP
export const httpLogger = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Capturar información del request
  const requestInfo = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    userName: req.user?.name || 'anonymous'
  };

  // Log del request entrante
  logger.http('HTTP Request', {
    ...requestInfo,
    type: 'request',
    body: req.method !== 'GET' ? req.body : undefined
  });

  // Interceptar la respuesta
  const originalEnd = res.end;
  res.end = function(chunk?: any, encoding?: any, cb?: any): Response {
    const duration = Date.now() - startTime;
    
    // Log del response
    logger.http('HTTP Response', {
      ...requestInfo,
      type: 'response',
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length') || 0
    });

    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
};

// Middleware para logging de errores
export const errorLogger = (err: any, req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  logger.error('HTTP Error', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userId: req.user?.id || 'anonymous',
    userName: req.user?.name || 'anonymous',
    error: err.message,
    stack: err.stack,
    statusCode: res.statusCode
  });

  next(err);
};
