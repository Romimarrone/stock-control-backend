const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del producto es obligatorio'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'La descripción es obligatoria'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
      index: true, // Optimiza búsquedas/filtros por categoría
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser menor a 0'],
      default: 0,
    },
    lastStockControl: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Middleware para actualizar lastStockControl automáticamente en actualizaciones
productSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.stock !== undefined || update.$set?.stock !== undefined) {
    this.set({ lastStockControl: new Date() });
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);