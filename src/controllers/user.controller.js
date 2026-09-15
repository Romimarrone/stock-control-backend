const User = require('../models/User');

// @desc    Obtener lista completa de usuarios
// @route   GET /api/users
// @access  Privado/Admin
const getUsers = async (req, res) => {
    try {
        // Excluimos el campo password de la respuesta por seguridad
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la lista de usuarios',
            code: 500,
        });
    }
};

// @desc    Cambiar estado de activación (suspender/activar) de un usuario
// @route   PATCH /api/users/:id/status
// @access  Privado/Admin
const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Obtener usuario actual
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    // 2. Actualizar directamente el flag de estado sin disparar validadores de password
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { isActive: !user.isActive },
      { new: true, runValidators: false }
    );

    res.json({
      success: true,
      message: 'Estado actualizado correctamente',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Error en toggleUserStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar el estado del usuario',
      error: error.message, // Incluir para depuración en desarrollo
    });
  }
};

// @desc    Eliminar la cuenta de un usuario
// @route   DELETE /api/users/:id
// @access  Privado/Admin
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        // Evitar que el admin autoelimine su cuenta
        if (req.user._id.toString() === id) {
            return res.status(400).json({
                success: false,
                message: 'No puede eliminar su propia cuenta de administrador',
                code: 400,
            });
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
                code: 404,
            });
        }

        res.status(200).json({
            success: true,
            message: `El usuario ${user.name} fue eliminado con éxito`,
            data: { _id: id },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al eliminar el usuario',
            code: 500,
        });
    }
};

module.exports = {
    getUsers,
    toggleUserStatus,
    deleteUser,
};