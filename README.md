# API Express.js con TypeScript y Swagger

Una API REST completa desarrollada con Express.js y TypeScript que incluye gestión de usuarios, productos, autenticación y documentación interactiva con Swagger UI.

## 🚀 Características

- **Express.js con TypeScript**: Framework web robusto con tipado estático
- **PostgreSQL**: Base de datos relacional para producción con persistencia completa
- **Autenticación Bearer Token**: Sistema de autenticación seguro para todas las rutas protegidas
- **Gestión de Usuarios**: CRUD completo de usuarios con protección de autenticación
- **Gestión de Productos**: Sistema completo de productos con 12 categorías, búsqueda y filtros
- **Swagger UI**: Documentación interactiva completa con pruebas en vivo
- **OpenAPI 3.0**: Especificación estándar para APIs REST
- **Sistema de Logging Completo**: Registro de todos los eventos con winston
  - 📄 Logs en archivos (`logs/combined.log`, `logs/error.log`, `logs/access.log`)
  - 🖥️ Logs en consola con colores (desarrollo)
  - 📊 Logging de requests HTTP, autenticación, errores y operaciones CRUD
- **TypeScript**: Desarrollo con tipado fuerte y mejor experiencia de desarrollo
- **Modular**: Arquitectura organizada con separación de responsabilidades
- **Seeder Scripts**: Scripts para poblar la base de datos con datos de prueba ## 🗄️ Base de Datos PostgreSQL

### Esquema de la Base de Datos

**Tabla `users`:**
- `id` - SERIAL PRIMARY KEY
- `name` - VARCHAR(255) NOT NULL
- `email` - VARCHAR(255) UNIQUE NOT NULL  
- `password` - VARCHAR(255) NOT NULL
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

**Tabla `products`:**
- `id` - SERIAL PRIMARY KEY
- `name` - VARCHAR(255) NOT NULL
- `description` - TEXT
- `price` - DECIMAL(10,2) NOT NULL
- `stock` - INTEGER NOT NULL DEFAULT 0
- `category` - VARCHAR(100) NOT NULL
- `active` - BOOLEAN DEFAULT true
- `created_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP
- `updated_at` - TIMESTAMP DEFAULT CURRENT_TIMESTAMP

### Características de PostgreSQL
- **Escalabilidad**: Mejor rendimiento para aplicaciones grandes
- **ACID Compliance**: Transacciones confiables
- **Tipos de Datos Avanzados**: Soporte para JSON, arrays, etc.
- **Conexiones Concurrentes**: Manejo eficiente de múltiples usuarios
- **Índices Automáticos**: Optimización de consultas

### Usuarios de Prueba
Al iniciar por primera vez, se crean automáticamente estos usuarios:
- **Email**: juan@example.com, **Password**: 123456
- **Email**: maria@example.com, **Password**: 654321

### Productos de Prueba
Al iniciar por primera vez, se crean automáticamente estos productos:
- **Laptop Dell XPS 13** - $1,299.99 (Tecnología) - Stock: 10
- **iPhone 15 Pro** - $999.99 (Tecnología) - Stock: 25
- **Auriculares Sony WH-1000XM5** - $349.99 (Audio) - Stock: 15
- **Mesa de Oficina** - $299.99 (Muebles) - Stock: 5
- **Silla Gaming** - $199.99 (Muebles) - Stock: 8

## 📁 Estructura del Proyecto

```
challege/
├── src/
│   ├── config/
│   │   ├── swagger.ts       # Configuración completa de Swagger/OpenAPI 3.0
│   │   └── logger.ts        # Configuración del sistema de logging con winston
│   ├── database/
│   │   └── database.ts      # Configuración y métodos de PostgreSQL
│   ├── middleware/
│   │   ├── auth.ts          # Middleware de autenticación Bearer Token
│   │   └── logging.ts       # Middleware de logging para HTTP requests
│   ├── routes/
│   │   ├── userRoutes.ts    # Rutas para gestión de usuarios (🔒 protegidas)
│   │   ├── authRoutes.ts    # Rutas para autenticación (públicas)
│   │   └── productRoutes.ts # Rutas para gestión de productos (🔒 protegidas)
│   ├── types/
│   │   ├── user.ts          # Interfaces y tipos TypeScript para usuarios
│   │   └── product.ts       # Interfaces y tipos TypeScript para productos
│   └── app.ts               # Archivo principal de la aplicación
├── logs/                    # Directorio de archivos de log (auto-creado)
│   ├── access.log          # Logs de requests HTTP
│   ├── error.log           # Solo logs de errores
│   └── combined.log        # Todos los logs combinados
├── dist/                    # Código compilado TypeScript -> JavaScript
├── node_modules/            # Dependencias del proyecto
├── .env                     # Variables de entorno (configuración de DB)
├── .gitignore              # Archivos excluidos del control de versiones
├── package.json            # Configuración del proyecto y dependencias
├── package-lock.json       # Versiones exactas de dependencias
├── README.md               # Documentación principal del proyecto
├── SWAGGER_README.md       # Guía específica de Swagger/OpenAPI
├── LOGGING_README.md       # Documentación completa del sistema de logging
├── test_auth_products.md   # Ejemplos de pruebas con autenticación
├── test-logging.sh         # Script de pruebas del sistema de logging
└── tsconfig.json           # Configuración del compilador TypeScript
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- npm
- PostgreSQL (v12 o superior)

### Configuración Rápida

#### Opción 1: PostgreSQL 17.5 con Docker (Recomendado para Desarrollo Rápido)

**Instalar Docker:**
```bash
# Windows: Descargar Docker Desktop desde docker.com
# macOS: brew install --cask docker
# Ubuntu: sudo apt install docker.io docker-compose
```

**🐳 Comandos Docker para PostgreSQL 17.5:**

**1. Comando Básico (Una sola línea):**
```bash
# Crear y ejecutar contenedor PostgreSQL 17.5
docker run --name postgres-challege \
  -e POSTGRES_DB=challege_api \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:17.5
```

**2. Comando con Persistencia de Datos:**
```bash
# Crear volumen para datos persistentes
docker volume create postgres_data

# Ejecutar con volumen montado
docker run --name postgres-challege \
  -e POSTGRES_DB=challege_api \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:17.5
```

**📋 Comandos de Gestión del Contenedor:**

```bash
# Verificar que está ejecutándose
docker ps

# Ver logs del contenedor
docker logs postgres-challege

# Ver logs en tiempo real
docker logs -f postgres-challege

# Conectar a la base de datos desde el contenedor
docker exec -it postgres-challege psql -U postgres -d challege_api

# Ejecutar comandos SQL directamente
docker exec -it postgres-challege psql -U postgres -c "SELECT version();"

# Obtener información del contenedor
docker inspect postgres-challege

# Ver estadísticas de uso
docker stats postgres-challege

# Hacer backup de la base de datos
docker exec postgres-challege pg_dump -U postgres challege_api > backup.sql

# Restaurar backup
docker exec -i postgres-challege psql -U postgres -d challege_api < backup.sql
```

**🔧 Comandos de Control:**

```bash
# Detener el contenedor
docker stop postgres-challege

# Iniciar el contenedor
docker start postgres-challege

# Reiniciar el contenedor
docker restart postgres-challege

# Pausar el contenedor (suspender procesos)
docker pause postgres-challege

# Reanudar el contenedor
docker unpause postgres-challege

# Eliminar el contenedor (¡cuidado! se pierden los datos sin volumen)
docker rm postgres-challege

# Eliminar el contenedor forzadamente
docker rm -f postgres-challege

# Eliminar contenedor y volumen (¡CUIDADO! Se pierden TODOS los datos)
docker rm -f postgres-challege && docker volume rm postgres_data
```

**🐙 Docker Compose (Recomendado para Desarrollo):**

Crear archivo `docker-compose.yml` en la raíz del proyecto:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:17.5
    container_name: postgres-challege
    environment:
      POSTGRES_DB: challege_api
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C"
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql  # Scripts de inicialización
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres -d challege_api"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
    driver: local
```

**📦 Comandos Docker Compose:**

```bash
# Iniciar PostgreSQL en segundo plano
docker-compose up -d

# Iniciar con logs visibles
docker-compose up

# Ver logs del servicio postgres
docker-compose logs postgres

# Ver logs en tiempo real
docker-compose logs -f postgres

# Verificar estado de los servicios
docker-compose ps

# Detener los servicios
docker-compose down

# Detener y eliminar volúmenes (¡CUIDADO! Se pierden los datos)
docker-compose down -v

# Reiniciar solo el servicio postgres
docker-compose restart postgres

# Ejecutar comandos en el contenedor
docker-compose exec postgres psql -U postgres -d challege_api

# Ver información de los contenedores
docker-compose top

# Validar archivo docker-compose.yml
docker-compose config
```

**🔍 Comandos de Diagnóstico:**

```bash
# Verificar conectividad desde el host
docker exec postgres-challege pg_isready -U postgres

# Ver configuración de PostgreSQL
docker exec postgres-challege cat /var/lib/postgresql/data/postgresql.conf

# Ver logs de PostgreSQL
docker exec postgres-challege tail -f /var/lib/postgresql/data/log/postgresql-*.log

# Verificar conexiones activas
docker exec postgres-challege psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Ver tamaño de la base de datos
docker exec postgres-challege psql -U postgres -c "SELECT pg_size_pretty(pg_database_size('challege_api'));"

# Listar todas las bases de datos
docker exec postgres-challege psql -U postgres -c "\l"

# Listar tablas en la base de datos
docker exec postgres-challege psql -U postgres -d challege_api -c "\dt"
```

**🚀 Script de Inicio Rápido:**

Crear archivo `start-postgres.sh`:
```bash
#!/bin/bash
echo "🐳 Iniciando PostgreSQL 17.5 con Docker..."

# Verificar si Docker está ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker no está ejecutándose. Por favor, inicia Docker primero."
    exit 1
fi

# Verificar si el contenedor ya existe
if docker ps -a --format 'table {{.Names}}' | grep -q postgres-challege; then
    echo "📦 Contenedor existente encontrado. Iniciando..."
    docker start postgres-challege
else
    echo "🆕 Creando nuevo contenedor PostgreSQL..."
    docker run --name postgres-challege \
      -e POSTGRES_DB=challege_api \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -p 5432:5432 \
      -v postgres_data:/var/lib/postgresql/data \
      --restart=unless-stopped \
      -d postgres:17.5
fi

# Esperar a que PostgreSQL esté listo
echo "⌛ Esperando a que PostgreSQL esté listo..."
sleep 5

# Verificar conexión
if docker exec postgres-challege pg_isready -U postgres > /dev/null 2>&1; then
    echo "✅ PostgreSQL está listo y funcionando!"
    echo "🔗 Conexión: localhost:5432"
    echo "🗄️ Base de datos: challege_api"
    echo "👤 Usuario: postgres"
    echo "🔑 Contraseña: postgres"
else
    echo "❌ Error: PostgreSQL no responde."
fi
```

Hacer ejecutable y usar:
```bash
chmod +x start-postgres.sh
./start-postgres.sh
```

**⚡ Comandos de Una Línea Útiles:**

```bash
# Iniciar PostgreSQL rápido (con datos persistentes)
docker run --name pg17 -e POSTGRES_PASSWORD=postgres -p 5432:5432 -v pgdata:/var/lib/postgresql/data -d postgres:17.5

# Conectar rápidamente
docker exec -it pg17 psql -U postgres

# Hacer backup rápido
docker exec pg17 pg_dump -U postgres postgres > backup_$(date +%Y%m%d_%H%M%S).sql

# Ver todos los contenedores PostgreSQL
docker ps --filter ancestor=postgres:17.5

# Limpiar todos los contenedores PostgreSQL detenidos
docker container prune --filter label=postgres
```

2. **Crear base de datos**
   ```sql
   psql -U postgres
   CREATE DATABASE challege_api;
   \q
   ```

3. **Configurar variables de entorno**
   ```bash
   # Copiar archivo de ejemplo
   cp .env.example .env
   
   # Editar .env con tu configuración de PostgreSQL
   ```

4. **Instalar dependencias**
   ```bash
   npm install
   ```

### Iniciar la Aplicación
```bash
# Desarrollo con recarga automática
npm run dev

# Compilar para producción
npm run build

# Ejecutar en producción
npm start
```

## 📚 Endpoints de la API

### 📖 **Documentación Interactiva con Swagger**
- **Swagger UI**: `http://localhost:3000/api-docs` 
- **Swagger JSON**: `http://localhost:3000/api-docs.json`

🎯 **Usa Swagger UI para**:
- Explorar todos los endpoints disponibles
- Probar la API directamente desde el navegador  
- Ver esquemas de datos y ejemplos
- Autenticarte con Bearer tokens
- Generar código cliente automáticamente

### 🏠 Información General
- **GET /** - Información de la API y endpoints disponibles

### 👥 Gestión de Usuarios (🔒 Requiere Autenticación)
- **GET /api/users** - Obtener todos los usuarios
- **GET /api/users/:id** - Obtener usuario específico por ID
- **POST /api/users** - Crear nuevo usuario
- **PUT /api/users/:id** - Actualizar usuario existente
- **DELETE /api/users/:id** - Eliminar usuario

⚠️ **Importante**: Todos los endpoints de usuarios requieren autenticación. Debes incluir el header `Authorization: Bearer <token>` obtenido del login.

### 🔐 Autenticación
- **POST /api/auth/login** - Iniciar sesión
- **POST /api/auth/logout** - Cerrar sesión
- **GET /api/auth/me** - Obtener información del usuario actual

### 🛍️ Gestión de Productos (🔒 Requiere Autenticación)
- **GET /api/products** - Obtener todos los productos (🔒 requiere auth)
  - Query params: `?category=Tecnología`, `?search=laptop`, `?active=true`
- **GET /api/products/:id** - Obtener producto específico por ID (🔒 requiere auth)
- **POST /api/products** - Crear nuevo producto (🔒 requiere auth)
- **PUT /api/products/:id** - Actualizar producto existente (🔒 requiere auth)
- **PATCH /api/products/:id/stock** - Actualizar solo el stock (🔒 requiere auth)
- **DELETE /api/products/:id** - Eliminar producto (🔒 requiere auth)

⚠️ **Importante**: Todos los endpoints de productos requieren autenticación. Debes incluir el header `Authorization: Bearer <token>` obtenido del login.

### 📊 Categorías de Productos Disponibles
- **Tecnología** - Laptops, smartphones, tablets
- **Audio** - Auriculares, altavoces, sistemas de sonido
- **Muebles** - Mesas, sillas, escritorios
- **Deportes** - Equipamiento deportivo y fitness
- **Libros** - Literatura, técnicos, educativos
- **Ropa** - Vestimenta y accesorios
- **Cocina** - Electrodomésticos y utensilios
- **Juguetes** - Entretenimiento infantil
- **Jardín** - Plantas y herramientas de jardinería
- **Electrónicos** - Gadgets y dispositivos electrónicos
- **Hogar** - Decoración y artículos para el hogar
- **Automotriz** - Accesorios y repuestos para vehículos

## 📝 Ejemplos de Uso

### 1. Obtener Token de Autenticación
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "123456"
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Login exitoso",
  "user": { "id": 1, "name": "Juan Pérez", "email": "juan@example.com" },
  "token": "token_1_1234567890"
}
```

### 2. Usar Token para Acceder a Usuarios (🔒 Protegido)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer token_1_1234567890"
```

### 3. Crear Usuario (🔒 Requiere Autenticación)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer token_1_1234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ana López",
    "email": "ana@example.com",
    "password": "mi_password"
  }'
```

### 4. Intentar Acceso sin Autenticación (❌ Fallará)
```bash
curl -X GET http://localhost:3000/api/users
```

**Respuesta de Error:**
```json
{
  "success": false,
  "message": "Token de autorización requerido. Debes estar logueado para acceder a este recurso."
}
```

### 5. Obtener Todos los Productos (🔒 Requiere Autenticación)
```bash
curl -X GET http://localhost:3000/api/products \
  -H "Authorization: Bearer token_1_1234567890"
```

### 6. Buscar Productos por Categoría (🔒 Requiere Autenticación)
```bash
curl -X GET "http://localhost:3000/api/products?category=Tecnología" \
  -H "Authorization: Bearer token_1_1234567890"
```

### 7. Buscar Productos por Término (🔒 Requiere Autenticación)
```bash
curl -X GET "http://localhost:3000/api/products?search=laptop" \
  -H "Authorization: Bearer token_1_1234567890"
```

### 8. Crear Nuevo Producto (🔒 Requiere Autenticación)
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer token_1_1234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MacBook Pro M3",
    "description": "Laptop profesional con chip M3 de Apple",
    "price": 2499.99,
    "stock": 5,
    "category": "Tecnología",
    "active": true
  }'
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Producto creado exitosamente",
  "product": {
    "id": 6,
    "name": "MacBook Pro M3",
    "description": "Laptop profesional con chip M3 de Apple",
    "price": 2499.99,
    "stock": 5,
    "category": "Tecnología",
    "active": true,
    "createdAt": "2025-08-01T10:30:00.000Z",
    "updatedAt": "2025-08-01T10:30:00.000Z"
  }
}
```

### 9. Actualizar Stock de Producto (🔒 Requiere Autenticación)
```bash
curl -X PATCH http://localhost:3000/api/products/1/stock \
  -H "Authorization: Bearer token_1_1234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 15
  }'
```

### 10. Actualizar Producto Completo (🔒 Requiere Autenticación)
```bash
curl -X PUT http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer token_1_1234567890" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell XPS 13 - Actualizada",
    "price": 1199.99,
    "stock": 12
  }'
```

### 11. Eliminar Producto (🔒 Requiere Autenticación)
```bash
curl -X DELETE http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer token_1_1234567890"
```

## 🔧 Configuración

### Variables de Entorno (.env)
```env
# Configuración de PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=challege_api
DB_USER=postgres
DB_PASSWORD=postgres

# Configuración del Servidor
PORT=3000

# Configuración de Autenticación
TOKEN_EXPIRY_HOURS=24
```

### Configuración de PostgreSQL
La aplicación se conecta automáticamente a PostgreSQL usando las variables de entorno. Asegúrate de:

1. Tener PostgreSQL ejecutándose
2. Crear la base de datos especificada en `DB_NAME`
3. Configurar las credenciales correctas en el archivo `.env`

Si la conexión falla, la aplicación mostrará información detallada sobre el error y cómo solucionarlo.

## � Autenticación y Seguridad

### Flujo de Autenticación
1. **Login**: `POST /api/auth/login` con email y password
2. **Obtener Token**: La respuesta incluye un token temporal
3. **Usar Token**: Incluir `Authorization: Bearer <token>` en las peticiones a `/api/users`
4. **Expiración**: Los tokens expiran después de 24 horas

### Middleware de Seguridad
- **Validación de Token**: Verificación automática en rutas protegidas
- **Formato de Token**: `token_userId_timestamp`
- **Expiración**: Tokens válidos por 24 horas
- **Verificación de Usuario**: Validación de existencia del usuario

### Rutas Protegidas vs Públicas
- **🔒 Protegidas**: Todas las rutas `/api/users/*` requieren autenticación
- **🌐 Públicas**: Rutas `/api/auth/*` (login, logout, etc.)
- **ℹ️ Información**: Ruta `/` para documentación

## �🗄️ Base de Datos SQLite

La aplicación utiliza SQLite como base de datos, que se crea automáticamente al iniciar el servidor por primera vez.

### Esquema de Base de Datos

**Tabla `users`:**
- `id` - INTEGER PRIMARY KEY AUTOINCREMENT
- `name` - TEXT NOT NULL
- `email` - TEXT UNIQUE NOT NULL  
- `password` - TEXT NOT NULL
- `created_at` - DATETIME DEFAULT CURRENT_TIMESTAMP

### Usuarios de Prueba
Al iniciar por primera vez, se crean automáticamente estos usuarios:
- **Email**: juan@example.com, **Password**: 123456
- **Email**: maria@example.com, **Password**: 654321

### Ubicación de la Base de Datos
El archivo `database.sqlite` se crea en la raíz del proyecto y persiste todos los datos entre reinicios del servidor.

## 🔒 Seguridad

⚠️ **Nota de Seguridad**: Esta es una implementación básica para demostración. En producción deberías:

- Usar bcrypt para hashear contraseñas
- Implementar JWT para tokens de autenticación
- Añadir rate limiting
- Usar HTTPS
- Validar y sanitizar todas las entradas
- Implementar autorización basada en roles

## 🚦 Scripts Disponibles

- `npm run build` - Compila TypeScript a JavaScript en el directorio `dist/`
- `npm run dev` - Ejecuta en modo desarrollo con recarga automática usando ts-node-dev
- `npm start` - Ejecuta la aplicación compilada desde `dist/app.js`
- `npm run seed-products` - Ejecuta el script para poblar la base de datos con 1000 productos
- `npm test` - Ejecuta las pruebas (pendiente de implementar)

## 📦 Dependencias

### Dependencias de Producción
- `express` (^4.18.2) - Framework web para Node.js
- `pg` (^8.16.3) - Driver de PostgreSQL para Node.js
- `dotenv` (^17.2.1) - Manejo de variables de entorno
- `swagger-jsdoc` (^6.2.8) - Generador de especificación OpenAPI desde anotaciones
- `swagger-ui-express` (^5.0.1) - Interfaz web para documentación Swagger
- `sqlite3` (^5.1.7) - Driver SQLite (para desarrollo/pruebas)
- `winston` (^3.14.2) - Sistema de logging avanzado con múltiples transportes

### Dependencias de Desarrollo
- `typescript` (^5.3.3) - Compilador de TypeScript
- `@types/express` (^4.17.21) - Tipos de TypeScript para Express
- `@types/node` (^20.10.5) - Tipos de TypeScript para Node.js
- `@types/pg` (^8.15.5) - Tipos de TypeScript para PostgreSQL
- `@types/sqlite3` (^3.1.11) - Tipos de TypeScript para SQLite3
- `@types/swagger-jsdoc` (^6.0.4) - Tipos para swagger-jsdoc
- `@types/swagger-ui-express` (^4.1.8) - Tipos para swagger-ui-express
- `ts-node-dev` (^2.0.0) - Herramienta de desarrollo para TypeScript con recarga automática

## 📊 Sistema de Logging

El proyecto incluye un sistema de logging completo que registra **todos los eventos** de la API:

### 📁 Archivos de Log
- `logs/combined.log` - Todos los logs
- `logs/error.log` - Solo errores  
- `logs/access.log` - Requests HTTP

### 🎯 Eventos Registrados
- ✅ **HTTP Requests/Responses** - Método, URL, IP, usuario, tiempo de respuesta
- ✅ **Autenticación** - Login exitoso, intentos fallidos, tokens generados
- ✅ **Operaciones CRUD** - Creación, actualización, eliminación de productos/usuarios
- ✅ **Errores** - Errores de aplicación, validación, base de datos
- ✅ **Eventos del Servidor** - Inicio, conexión DB, rutas no encontradas

### 🖥️ Visualización
- **Consola** (desarrollo): Logs con colores en tiempo real
- **Archivos** (producción): Logs estructurados en JSON
- **Formato**: Timestamp, nivel, mensaje, metadata contextual

📚 **Documentación completa**: Ver [LOGGING_README.md](./LOGGING_README.md)

## 📚 Documentación Adicional

- **📖 [SWAGGER_README.md](./SWAGGER_README.md)** - Guía completa de Swagger UI y OpenAPI 3.0
- **📊 [LOGGING_README.md](./LOGGING_README.md)** - Sistema completo de logging con winston
- **🧪 [test_auth_products.md](./test_auth_products.md)** - Ejemplos de pruebas con autenticación y productos
- **🔧 [test-logging.sh](./test-logging.sh)** - Script de pruebas del sistema de logging
- **⚙️ [tsconfig.json](./tsconfig.json)** - Configuración del compilador TypeScript
- **🔒 [.env](./.env)** - Variables de entorno (no incluir en repositorio)
- **📋 [.gitignore](./.gitignore)** - Archivos excluidos del control de versiones

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -am 'Añadir nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC.
