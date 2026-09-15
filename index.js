require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db.js');

const PORT = process.env.PORT || 5000;

// Conectar a la base de datos e iniciar servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
});