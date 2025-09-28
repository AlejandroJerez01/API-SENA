require('dotenv').config();
const express = require('express');
const conectarDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

// conectar a Mongo
conectarDB();

// middlewares
app.use(express.json());

// rutas
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/productos', require('./routes/productos'));

// ruta base
app.get('/', (req, res) => res.send('API SENA - Corriendo'));

app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
