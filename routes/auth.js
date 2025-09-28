const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Login
router.post('/login', async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ message: 'Faltan datos' });

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) return res.status(400).json({ message: 'Usuario no encontrado' });

    const validPassword = await bcrypt.compare(password, usuario.password);
    if (!validPassword) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const payload = { _id: usuario._id, correo: usuario.correo };
    const secreto = process.env.JWT_SECRET || 'secreto_local';
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const token = jwt.sign(payload, secreto, { expiresIn });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
