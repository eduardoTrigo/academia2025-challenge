# 📚 Documentación Swagger API

## 🎯 Configuración Completada

He configurado **Swagger UI** en tu API Express.js con TypeScript para generar documentación automática e interactiva.

## 🔗 Enlaces Disponibles

### 📖 **Swagger UI (Interfaz Interactiva)**
```
http://localhost:3000/api-docs
```
- Interfaz web completa para probar endpoints
- Autenticación integrada con Bearer Token
- Ejemplos de requests y responses
- Esquemas de datos detallados

### 📄 **Swagger JSON (Especificación OpenAPI)**
```
http://localhost:3000/api-docs.json
```
- Especificación OpenAPI 3.0 en formato JSON
- Útil para generar clientes automáticos
- Importable a otras herramientas (Postman, Insomnia)

## 🛠️ Características Implementadas

### 🔐 **Autenticación**
- **Esquema**: Bearer Token
- **Formato**: `Authorization: Bearer token_userId_timestamp`
- **Obtención**: Endpoint `POST /api/auth/login`

### 📋 **Endpoints Documentados**

#### **Autenticación** 🔐
- ✅ `POST /api/auth/login` - Iniciar sesión
- ✅ `POST /api/auth/logout` - Cerrar sesión  
- ✅ `GET /api/auth/me` - Información del usuario actual

#### **Productos** 🛍️
- ✅ `GET /api/products` - Listar productos (con filtros)
- ✅ `POST /api/products` - Crear producto
- 🔄 `GET /api/products/{id}` - Pendiente
- 🔄 `PUT /api/products/{id}` - Pendiente
- 🔄 `PATCH /api/products/{id}/stock` - Pendiente
- 🔄 `DELETE /api/products/{id}` - Pendiente

#### **Usuarios** 👥
- 🔄 Pendiente de documentar

### 📊 **Esquemas de Datos**

#### **Product**
```json
{
  "id": 1,
  "name": "string",
  "description": "string",
  "price": 99.99,
  "stock": 10,
  "category": "Tecnología",
  "active": true,
  "createdAt": "2025-08-01T10:00:00.000Z",
  "updatedAt": "2025-08-01T10:00:00.000Z"
}
```

#### **User**
```json
{
  "id": 1,
  "name": "string",
  "email": "user@example.com",
  "createdAt": "2025-08-01T10:00:00.000Z"
}
```

#### **LoginRequest**
```json
{
  "email": "juan@example.com",
  "password": "123456"
}
```

## 🚀 Cómo Usar Swagger UI

### **1. Acceder a la Documentación**
1. Ir a `http://localhost:3000/api-docs`
2. Explorar los endpoints disponibles
3. Ver esquemas de datos en la sección "Schemas"

### **2. Autenticarse**
1. Hacer click en "Authorize" 🔒
2. Obtener token del endpoint `/api/auth/login`
3. Ingresar: `Bearer token_1_1234567890`
4. Hacer click en "Authorize"

### **3. Probar Endpoints**
1. Expandir cualquier endpoint
2. Hacer click en "Try it out"
3. Completar los parámetros necesarios
4. Hacer click en "Execute"
5. Ver la respuesta en tiempo real

## 📁 Archivos de Configuración

### **`src/config/swagger.ts`**
- Configuración principal de Swagger
- Definición de esquemas
- Configuración de seguridad
- Metadatos de la API

### **Anotaciones en Rutas**
```typescript
/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener todos los productos
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 */
```

## 🎨 Personalización

### **Cambiar Tema y Estilos**
En `src/config/swagger.ts`:
```typescript
swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Mi API Documentation',
  swaggerOptions: {
    docExpansion: 'none', // none, list, full
    filter: true,
    showRequestDuration: true
  }
})
```

### **Agregar Más Endpoints**
1. Agregar anotaciones `@swagger` en las rutas
2. Seguir el formato OpenAPI 3.0
3. El servidor se actualiza automáticamente

## 🔧 Comandos Útiles

### **Verificar Configuración**
```bash
curl http://localhost:3000/api-docs.json | jq '.'
```

### **Validar Especificación**
```bash
npm install -g swagger-jsdoc-cli
swagger-jsdoc --validate src/config/swagger.ts
```

## 📱 Integración con Otras Herramientas

### **Postman**
1. Importar desde: `http://localhost:3000/api-docs.json`
2. Configurar autenticación Bearer Token
3. Usar colección generada automáticamente

### **Insomnia**
1. File → Import → URL
2. Ingresar: `http://localhost:3000/api-docs.json`
3. Configurar Bearer Token en Environment

### **Cliente Automático**
```bash
# Generar cliente JavaScript
npm install @openapitools/openapi-generator-cli
openapi-generator-cli generate -i http://localhost:3000/api-docs.json -g javascript -o ./client
```

## 🎯 Próximos Pasos

1. **Completar documentación** de todos los endpoints
2. **Agregar ejemplos** más detallados
3. **Incluir códigos de error** específicos
4. **Documentar modelos** de respuesta
5. **Agregar validaciones** de esquemas

## 🐛 Troubleshooting

### **Swagger UI no carga**
- Verificar que el servidor esté en puerto 3000
- Revisar logs de consola por errores
- Verificar que las rutas estén en `apis` del config

### **Endpoints no aparecen**
- Verificar anotaciones `@swagger` en archivos de rutas
- Verificar que las rutas estén incluidas en `apis`
- Reiniciar el servidor

### **Autenticación no funciona**
- Verificar formato: `Bearer token_userId_timestamp`
- Verificar que el token sea válido
- Revisar configuración de `securitySchemes`

---

**🎉 ¡Swagger está completamente configurado y funcionando!**

Accede a `http://localhost:3000/api-docs` para ver tu documentación interactiva.
