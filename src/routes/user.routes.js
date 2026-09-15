const express = require('express');
const router = express.Router();
const {
    getUsers,
    toggleUserStatus,
    deleteUser,
} = require('../controllers/user.controller');
const { protect, admin } = require('../middlewares/auth.middleware');

// Aplicar protección global a todas las rutas de usuarios
router.use(protect);
router.use(admin);

router.get('/', getUsers);
router.patch('/:id/status', toggleUserStatus);
router.delete('/:id', deleteUser);

module.exports = router;