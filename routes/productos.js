const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const verificarToken = require('../middleware/verificarToken');

   // Crear producto
   router.post('/', verificarToken, async (req, res) => {
     try {
       console.log('req.user:', req.user);  // Para debug
       console.log('typeof req.user._id:', typeof req.user?._id);
       // Validación extra para evitar el error
       if (!req.user || !req.user._id) {
         return res.status(401).json({ message: 'Usuario no autenticado o token inválido' });
       }
       const { nombre, descripcion, precio, stock } = req.body;
       if (!nombre || typeof precio === 'undefined') {
         return res.status(400).json({ message: 'Faltan campos obligatorios' });
       }
       const nuevo = new Producto({ 
         nombre, 
         descripcion, 
         precio, 
         stock, 
         creadoPor: req.user._id  // Ahora debería funcionar
       });
       await nuevo.save();
       res.status(201).json(nuevo);
     } catch (error) {
       console.error('Error en POST producto:', error);  // Para debug en logs
       res.status(500).json({ error: error.message });
     }
   });

// Obtener todos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().populate('creadoPor', 'nombre correo');
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const producto = await Producto.findById(id).populate('creadoPor', 'nombre correo');
    if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(producto);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Actualizar
router.put('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const actualizado = await Producto.findByIdAndUpdate(id, updates, { new: true });
    if (!actualizado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar
router.delete('/:id', verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Producto.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
