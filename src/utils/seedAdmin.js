require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const seedAdmin = async () => {
    try {
        // 1. Conectar a MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB para la creación del Administrador...');

        // 2. Verificar si ya existe un Administrador
        const adminExists = await User.findOne({ role: 'admin' });

        if (adminExists) {
            console.log('⚠️ Ya existe al menos un usuario Administrador en la base de datos.');
            process.exit(0);
        }

        // 3. Crear el Administrador inicial
        // (La contraseña se hashea automáticamente mediante el middleware 'pre-save' del modelo)
        const adminUser = new User({
            name: 'Administrador Principal',
            email: 'admin@stockcontrol.com',
            password: 'AdminPassword123!',
            role: 'admin',
            isActive: true,
        });

        await adminUser.save();

        console.log('✅ Usuario Administrador creado exitosamente:');
        console.log(`   Email: ${adminUser.email}`);
        console.log(`   Password: AdminPassword123!`);
        console.log('   Rol: admin');

        process.exit(0);
    } catch (error) {
        console.error(`❌ Error al crear el usuario Administrador: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();