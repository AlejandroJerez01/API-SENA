const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Registro (crear usuario)
router.post('/', async (req, res) => {
  try {
    const { nombre, correo, password, edad } = req.body;

    if (!nombre || !correo || !password) return res.status(400).json({ message: 'Faltan datos obligatorios' });

    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ message: 'Correo ya registrado' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({ nombre, correo, password: hashedPassword, edad });
    await nuevoUsuario.save();

    const usuarioResp = nuevoUsuario.toObject();
    delete usuarioResp.password;

    res.status(201).json(usuarioResp);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id).select('-password');
    if (!usuario) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    if (updates.password) delete updates.password;
    const actualizado = await Usuario.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!actualizado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(actualizado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const eliminado = await Usuario.findByIdAndDelete(id);
    if (!eliminado) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
