const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    updateProductStock,
    deleteProduct,
} = require('../controllers/product.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

router.get('/', getProducts);
router.get('/:id', getProductById);

router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.patch('/:id/stock', protect, updateProductStock);

module.exports = router;