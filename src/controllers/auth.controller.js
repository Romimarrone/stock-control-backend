const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Público
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya se encuentra registrado',
                code: 400,
            });
        }

        // Crear el usuario (la contraseña se hashea automáticamente en el modelo)
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'user',
        });

        res.status(201).json({
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id, user.role),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || 'Error al registrar el usuario',
            code: 500,
        });
    }
};

// @desc    Autenticar usuario y obtener token
// @route   POST /api/auth/login
// @access  Público
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar presencia de campos
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor ingrese email y contraseña',
                code: 400,
            });
        }

        // Buscar usuario
        const user = await User.findOne({ email });

        // Verificar existencia y contraseña
        if (user && (await user.matchPassword(password))) {
            // Verificar si la cuenta está suspendida
            if (!user.isActive) {
                return res.status(403).json({
                    success: false,
                    message: 'Su cuenta se encuentra suspendida. Contacte al administrador.',
                    code: 403,
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role),
                },
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Credenciales inválidas (email o contraseña incorrectos)',
                code: 401,
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error en el servidor al iniciar sesión',
            code: 500,
        });
    }
};

// @desc    Obtener perfil del usuario logueado
// @route   GET /api/auth/me
// @access  Privado (requiere token)
const getUserProfile = async (req, res) => {
    res.status(200).json({
        success: true,
        data: req.user,
    });
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
};