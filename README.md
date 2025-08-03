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
academia2025-challenge/
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
├── LOGGING_README.md       # Documentación completa del sistema de logging
└── tsconfig.json           # Configuración del compilador TypeScript
```

## 🛠️ Instalación y Configuración

### Prerrequisitos
- Node.js (v14 o superior)
- npm
- Docker Desktop

### Configuración Rápida

**1. Comando Básico (levanta la base de datos con datos precargados):**
```bash
docker run --name academia2025-challenge -d ghcr.io/jonathanvgms/academia2025-challenge
```

### Iniciar la Aplicación
```bash
# Instalar dependencias
npm install

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

## 📚 Documentación Adicional

- **📖 [SWAGGER_README.md](./SWAGGER_README.md)** - Guía completa de Swagger UI y OpenAPI 3.0
- **📊 [LOGGING_README.md](./LOGGING_README.md)** - Sistema completo de logging con winston
- **⚙️ [tsconfig.json](./tsconfig.json)** - Configuración del compilador TypeScript
- **🔒 [.env](./.env)** - Variables de entorno (no incluir en repositorio)
- **📋 [.gitignore](./.gitignore)** - Archivos excluidos del control de versiones
