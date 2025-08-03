import express from 'express';
import { db } from '../database/database';
import { authenticateToken } from '../middleware/auth';
import { CreateProductRequest, UpdateProductRequest } from '../types/product';
import logger from '../config/logger';

const router = express.Router();

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener todos los productos
 *     description: Retorna una lista de productos con filtros opcionales
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría
 *         example: "Tecnología"
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Buscar por término en nombre, descripción o categoría
 *         example: "laptop"
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filtrar por estado activo
 *         example: "true"
 *     responses:
 *       200:
 *         description: Lista de productos encontrados
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
 *                   example: "5 productos encontrados"
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /products - Obtener todos los productos (🔒 requiere autenticación)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, search, active } = req.query;
    let products;

    if (search) {
      // Buscar productos por término
      products = await db.searchProducts(search as string);
    } else if (category) {
      // Filtrar por categoría
      products = await db.getProductsByCategory(category as string);
    } else {
      // Obtener todos los productos
      products = await db.getAllProducts();
      
      // Filtrar por estado activo si se especifica
      if (active !== undefined) {
        const isActive = active === 'true';
        products = products.filter(product => product.active === isActive);
      }
    }

    res.json({
      success: true,
      message: `${products.length} productos encontrados`,
      products
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Productos]
 *     summary: Obtener producto por ID
 *     description: Retorna un producto específico por su ID
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del producto
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto encontrado
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
 *                   example: "Producto encontrado"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID de producto inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "ID de producto inválido"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Producto no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /products/:id - Obtener producto por ID (🔒 requiere autenticación)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const product = await db.getProductById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Producto encontrado',
      product
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Productos]
 *     summary: Crear nuevo producto
 *     description: Crea un nuevo producto en el sistema
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, description, price, stock, category]
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: "MacBook Pro M3"
 *               description:
 *                 type: string
 *                 description: Descripción detallada del producto
 *                 example: "Laptop profesional con chip M3 de Apple"
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: Precio del producto
 *                 example: 2499.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Cantidad en stock
 *                 example: 10
 *               category:
 *                 type: string
 *                 description: Categoría del producto
 *                 example: "Tecnología"
 *               active:
 *                 type: boolean
 *                 description: Estado activo del producto
 *                 default: true
 *                 example: true
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
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
 *                   example: "Producto creado exitosamente"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Faltan campos requeridos: name, description, price, stock, category"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Producto duplicado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Ya existe un producto con ese nombre"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /products - Crear nuevo producto (requiere autenticación)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, stock, category, active = true }: CreateProductRequest = req.body;

    // Validaciones
    if (!name || !description || !price || stock === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: name, description, price, stock, category'
      });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número mayor a 0'
      });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'El stock debe ser un número mayor o igual a 0'
      });
    }

    const product = await db.createProduct(name, description, price, stock, category, active);

    logger.info('Producto creado exitosamente', {
      productId: product.id,
      productName: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      createdBy: req.user?.name,
      userId: req.user?.id
    });

    res.status(201).json({
      success: true,
      message: 'Producto creado exitosamente',
      product
    });
  } catch (error) {
    logger.error('Error al crear producto', {
      productData: req.body,
      userId: req.user?.id,
      userName: req.user?.name,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    if (error instanceof Error && error.message.includes('duplicate')) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un producto con ese nombre'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Productos]
 *     summary: Actualizar producto completo
 *     description: Actualiza uno o más campos de un producto existente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del producto
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del producto
 *                 example: "MacBook Pro M3 - Actualizado"
 *               description:
 *                 type: string
 *                 description: Descripción del producto
 *                 example: "Laptop profesional actualizada con chip M3"
 *               price:
 *                 type: number
 *                 format: float
 *                 minimum: 0
 *                 description: Precio del producto
 *                 example: 2299.99
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Cantidad en stock
 *                 example: 15
 *               category:
 *                 type: string
 *                 description: Categoría del producto
 *                 example: "Tecnología"
 *               active:
 *                 type: boolean
 *                 description: Estado activo del producto
 *                 example: true
 *           example:
 *             name: "Laptop Dell XPS 13 - Actualizada"
 *             price: 1199.99
 *             stock: 12
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
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
 *                   example: "Producto actualizado exitosamente"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "No hay campos válidos para actualizar"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Producto no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// PUT /products/:id - Actualizar producto (requiere autenticación)
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const updates: UpdateProductRequest = req.body;

    // Validar que hay al menos un campo para actualizar
    const allowedFields = ['name', 'description', 'price', 'stock', 'category', 'active'];
    const hasValidFields = Object.keys(updates).some(key => allowedFields.includes(key));

    if (!hasValidFields) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos válidos para actualizar'
      });
    }

    // Validar tipos de datos
    if (updates.price !== undefined && (typeof updates.price !== 'number' || updates.price <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser un número mayor a 0'
      });
    }

    if (updates.stock !== undefined && (typeof updates.stock !== 'number' || updates.stock < 0)) {
      return res.status(400).json({
        success: false,
        message: 'El stock debe ser un número mayor o igual a 0'
      });
    }

    const product = await db.updateProduct(id, updates);

    res.json({
      success: true,
      message: 'Producto actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    
    if (error instanceof Error && error.message === 'Producto no encontrado') {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

/**
 * @swagger
 * /api/products/{id}/stock:
 *   patch:
 *     tags: [Productos]
 *     summary: Actualizar stock del producto
 *     description: Actualiza únicamente la cantidad en stock de un producto
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del producto
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [stock]
 *             properties:
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Nueva cantidad en stock
 *                 example: 25
 *           example:
 *             stock: 15
 *     responses:
 *       200:
 *         description: Stock actualizado exitosamente
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
 *                   example: "Stock actualizado exitosamente"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "El stock debe ser un número mayor o igual a 0"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Producto no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// PATCH /products/:id/stock - Actualizar solo el stock (requiere autenticación)
router.patch('/:id/stock', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { stock } = req.body;
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'El stock debe ser un número mayor o igual a 0'
      });
    }

    const product = await db.updateProductStock(id, stock);

    res.json({
      success: true,
      message: 'Stock actualizado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al actualizar stock:', error);
    
    if (error instanceof Error && error.message === 'Producto no encontrado') {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Productos]
 *     summary: Eliminar producto
 *     description: Elimina un producto del sistema de forma permanente
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID único del producto a eliminar
 *         example: 1
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
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
 *                   example: "Producto eliminado exitosamente"
 *                 product:
 *                   $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID de producto inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "ID de producto inválido"
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               success: false
 *               message: "Producto no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// DELETE /products/:id - Eliminar producto (requiere autenticación)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto inválido'
      });
    }

    const product = await db.deleteProduct(id);

    res.json({
      success: true,
      message: 'Producto eliminado exitosamente',
      product
    });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    
    if (error instanceof Error && error.message === 'Producto no encontrado') {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
});

export default router;
