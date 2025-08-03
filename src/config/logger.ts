import winston from 'winston';
import path from 'path';

// Formato personalizado para los logs
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  let logMessage = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  
  // Agregar información adicional si existe
  if (Object.keys(meta).length > 0) {
    logMessage += ` | ${JSON.stringify(meta)}`;
  }
  
  return logMessage;
});

// Configuración del logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: { service: 'challege-api' },
  transports: [
    // Archivo de logs de errores
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat
      )
    }),
    
    // Archivo de logs combinados (todos los niveles)
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat
      )
    }),
    
    // Archivo de logs de acceso (requests HTTP)
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'access.log'),
      level: 'http',
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss'
        }),
        logFormat
      )
    })
  ]
});

// Si no estamos en producción, también loggear a la consola
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      logFormat
    )
  }));
}

// Crear directorio de logs si no existe
import fs from 'fs';
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export default logger;
