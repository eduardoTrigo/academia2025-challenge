# Sistema de Logging - Challenge API

## 📋 Descripción

El sistema de logging implementado registra **todos los eventos** de la API, incluyendo:

- **Requests HTTP** (entrada y salida)
- **Autenticación** (login exitoso, intentos fallidos)
- **Operaciones CRUD** (crear, actualizar, eliminar productos/usuarios)
- **Errores** (errores de aplicación, rutas no encontradas)
- **Eventos del servidor** (inicio, conexión a base de datos)

## 📁 Archivos de Log

Los logs se guardan en el directorio `logs/` con la siguiente estructura:

```
logs/
├── access.log      # Logs de requests HTTP (nivel: http)
├── error.log       # Solo errores (nivel: error)
└── combined.log    # Todos los logs (todos los niveles)
```

## 🎯 Niveles de Log

- **error**: Errores críticos y excepciones
- **warn**: Advertencias (ej: rutas no encontradas, intentos de login fallidos)
- **info**: Información general (ej: login exitoso, operaciones completadas)
- **http**: Requests y responses HTTP
- **debug**: Información de depuración

## 🔍 Qué se Registra

### 🌐 Requests HTTP
```json
{
  "level": "http",
  "message": "HTTP Request",
  "timestamp": "2025-08-03 15:30:45",
  "method": "POST",
  "url": "/api/products",
  "ip": "::1",
  "userAgent": "PostmanRuntime/7.32.0",
  "userId": 1,
  "userName": "Juan Pérez",
  "type": "request",
  "body": { "name": "Nuevo Producto", "price": 100 }
}
```

### ✅ Autenticación Exitosa
```json
{
  "level": "info",
  "message": "Login exitoso",
  "timestamp": "2025-08-03 15:30:45",
  "userId": 1,
  "userName": "Juan Pérez",
  "email": "juan@example.com",
  "ip": "::1",
  "userAgent": "PostmanRuntime/7.32.0"
}
```

### ❌ Intento de Login Fallido
```json
{
  "level": "warn",
  "message": "Intento de login fallido - contraseña incorrecta",
  "timestamp": "2025-08-03 15:30:45",
  "email": "juan@example.com",
  "userId": 1,
  "ip": "::1",
  "userAgent": "PostmanRuntime/7.32.0"
}
```

### 🛍️ Creación de Producto
```json
{
  "level": "info",
  "message": "Producto creado exitosamente",
  "timestamp": "2025-08-03 15:30:45",
  "productId": 6,
  "productName": "MacBook Pro M3",
  "category": "Tecnología",
  "price": 2499.99,
  "stock": 5,
  "createdBy": "Juan Pérez",
  "userId": 1
}
```

### 🚨 Errores de Aplicación
```json
{
  "level": "error",
  "message": "Error al crear producto",
  "timestamp": "2025-08-03 15:30:45",
  "productData": { "name": "Producto", "price": "invalid" },
  "userId": 1,
  "userName": "Juan Pérez",
  "error": "ValidationError: Price must be a number",
  "stack": "Error: ValidationError..."
}
```

## 🖥️ Visualización en Consola

En desarrollo (NODE_ENV !== 'production'), los logs también se muestran en consola con colores:

```bash
2025-08-03 15:30:45 [INFO]: Servidor iniciado exitosamente | {"port":3000,"apiDocs":"http://localhost:3000/api-docs","environment":"development"}
2025-08-03 15:30:47 [HTTP]: HTTP Request | {"method":"POST","url":"/api/auth/login","ip":"::1","userAgent":"PostmanRuntime/7.32.0","userId":"anonymous","userName":"anonymous","type":"request"}
2025-08-03 15:30:47 [INFO]: Login exitoso | {"userId":1,"userName":"Juan Pérez","email":"juan@example.com","ip":"::1","userAgent":"PostmanRuntime/7.32.0"}
```

## ⚙️ Configuración

### Variables de Entorno

Puedes controlar el logging con estas variables en `.env`:

```env
# Configuración de Logging
NODE_ENV=development          # development = logs en consola, production = solo archivos
LOG_LEVEL=info               # Nivel mínimo de logs (error, warn, info, http, debug)
```

### Personalización

Para modificar el sistema de logging, edita `src/config/logger.ts`:

```typescript
// Cambiar formato de logs
const logFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message} | ${JSON.stringify(meta)}`;
});

// Agregar nuevos transportes (ej: base de datos, email)
logger.add(new winston.transports.MongoDB({
  db: 'mongodb://localhost:27017/logs',
  collection: 'api_logs'
}));
```

## 📊 Monitoreo y Análisis

### Comandos Útiles para Análisis

```bash
# Ver logs en tiempo real
tail -f logs/combined.log

# Filtrar solo errores
grep "ERROR" logs/combined.log

# Contar requests por método HTTP
grep "HTTP Request" logs/access.log | grep -o '"method":"[^"]*"' | sort | uniq -c

# Ver intentos de login fallidos
grep "login fallido" logs/combined.log

# Analizar rendimiento (requests por minuto)
grep "HTTP Response" logs/access.log | grep "$(date +%Y-%m-%d)" | wc -l
```

### Estadísticas de Uso

```bash
# Top 10 IPs más activas
grep '"ip":' logs/access.log | grep -o '"ip":"[^"]*"' | sort | uniq -c | sort -nr | head -10

# Endpoints más utilizados
grep '"url":' logs/access.log | grep -o '"url":"[^"]*"' | sort | uniq -c | sort -nr

# Usuarios más activos
grep '"userName":' logs/combined.log | grep -v '"userName":"anonymous"' | grep -o '"userName":"[^"]*"' | sort | uniq -c | sort -nr
```

## 🔒 Seguridad y Privacidad

- **Contraseñas**: Nunca se logguean las contraseñas
- **Tokens**: No se registran tokens completos
- **Datos sensibles**: Los datos de entrada se filtran antes del logging
- **IP Logging**: Se registran las IPs para análisis de seguridad

## 🧹 Mantenimiento

### Rotación de Logs

Para producción, considera implementar rotación de logs:

```bash
# Instalar winston-daily-rotate-file
npm install winston-daily-rotate-file

# Configurar en logger.ts
import DailyRotateFile from 'winston-daily-rotate-file';

logger.add(new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d'
}));
```

### Limpieza Automática

Script para limpiar logs antiguos:

```bash
# Crear script cleanup-logs.sh
#!/bin/bash
find logs/ -name "*.log" -mtime +30 -delete
echo "Logs más antiguos de 30 días eliminados"
```

## 📈 Métricas y Alertas

### Integración con Sistemas de Monitoreo

El formato JSON permite fácil integración con:

- **ELK Stack** (Elasticsearch, Logstash, Kibana)
- **Prometheus + Grafana**
- **Datadog**
- **New Relic**

### Alertas Recomendadas

- Más de 10 errores 500 en 5 minutos
- Más de 50 intentos de login fallidos en 10 minutos
- Respuestas HTTP > 2 segundos
- Uso de memoria > 80%

¡El sistema de logging está completo y listo para monitorear toda la actividad de tu API! 🎉
