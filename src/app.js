const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Servidor backend en ejecución' });
});

// Registrar rutas de la API (las agregaremos a medida que construyamos los módulos)
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/users', require('./routes/user.routes'));

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `La ruta ${req.originalUrl} no fue encontrada en el servidor.`,
        code: 404
    });
});

module.exports = app;