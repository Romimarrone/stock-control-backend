const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para verificar token JWT
const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            // Obtener el token del header Authorization
            token = req.headers.authorization.split(' ')[1];

            // Verificar y decodificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Buscar el usuario en la BD excluyendo la contraseña
            const user = await User.findById(decoded.id).select('-password');

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'No autorizado, usuario no encontrado',
                    code: 401,
                });
            }

            // Verificar si la cuenta está activa
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Su cuenta ha sido suspendida. Contacte al administrador.',
                    code: 403,
                });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'No autorizado, token no válido o expirado',
                code: 401,
            });
        }
    }

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'No autorizado, no se proporcionó un token',
            code: 401,
        });
    }
};

// Middleware para restringir accesos a Administradores
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado: Se requieren permisos de Administrador',
            code: 403,
        });
    }
};

module.exports = { protect, admin };