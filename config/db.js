const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/senaDB';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = conectarDB;
