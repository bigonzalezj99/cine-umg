const express = require('express');
const cors = require('cors');
const peliculaRoutes = require('./routes/peliculaRoutes');
const path = require('path'); // Importa el módulo path

const app = express();

// Configuración.
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Sirve la carpeta uploads

// Rutas
app.use('/api/peliculas', peliculaRoutes);

// Manejo de errores (opcional).
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Algo salió mal!');
});

// Puerto.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});