const Product = require('../models/Product');

// @desc    Obtener lista de productos (con filtro opcional por categoría)
// @route   GET /api/products
// @access  Público
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};

        // Si viene el parámetro de categoría, filtramos (insensible a mayúsculas/minúsculas)
        if (category) {
            query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener los productos',
            code: 500,
        });
    }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
// @access  Público
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
                code: 404,
            });
        }

        res.status(200).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el producto',
            code: 500,
        });
    }
};

// @desc    Crear un nuevo producto
// @route   POST /api/products
// @access  Privado/Admin
const createProduct = async (req, res) => {
    try {
        const { name, description, category, stock } = req.body;

        // Validaciones básicas
        if (!name || !description || !category || stock === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Por favor complete todos los campos obligatorios (nombre, descripción, categoría y stock)',
                code: 400,
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'El stock no puede ser un valor negativo',
                code: 400,
            });
        }

        const product = await Product.create({
            name,
            description,
            category,
            stock,
            lastStockControl: new Date(),
        });

        res.status(201).json({
            success: true,
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al crear el producto',
            code: 500,
        });
    }
};

// @desc    Actualización completa de datos del producto
// @route   PUT /api/products/:id
// @access  Privado/Admin
const updateProduct = async (req, res) => {
    try {
        const { name, description, category, stock } = req.body;

        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
                code: 404,
            });
        }

        if (stock !== undefined && stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'El stock no puede ser negativo',
                code: 400,
            });
        }

        // Actualización de campos
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;

        if (stock !== undefined) {
            product.stock = stock;
            product.lastStockControl = new Date(); // Actualiza fecha de control
        }

        const updatedProduct = await product.save();

        res.status(200).json({
            success: true,
            data: updatedProduct,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el producto',
            code: 500,
        });
    }
};

// @desc    Carga o actualización rápida del stock de un producto
// @route   PATCH /api/products/:id/stock
// @access  Privado (Usuarios autenticados / Admin según requerimiento)
const updateProductStock = async (req, res) => {
    try {
        const { stock } = req.body;

        if (stock === undefined || typeof stock !== 'number' || stock < 0) {
            return res.status(400).json({
                success: false,
                message: 'Debe proporcionar un valor numérico válido mayor o igual a 0 para el stock',
                code: 400,
            });
        }

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
                code: 404,
            });
        }

        product.stock = stock;
        product.lastStockControl = new Date(); // Registra fecha exacta del último control

        await product.save();

        res.status(200).json({
            success: true,
            message: 'Stock actualizado correctamente',
            data: {
                _id: product._id,
                name: product.name,
                stock: product.stock,
                lastStockControl: product.lastStockControl,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el stock del producto',
            code: 500,
        });
    }
};

// @desc    Eliminar un producto
// @route   DELETE /api/products/:id
// @access  Privado/Admin
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Producto no encontrado',
                code: 404,
            });
        }

        res.status(200).json({
            success: true,
            message: 'Producto eliminado con éxito',
            data: { _id: req.params.id },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el producto',
            code: 500,
        });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
};