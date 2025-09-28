const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  edad: { type: Number, default: 18 }
}, { timestamps: true });

module.exports = mongoose.model('Usuario', usuarioSchema);
