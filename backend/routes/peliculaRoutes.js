const express = require('express');
const router = express.Router();
const upload = require('../config/upload'); // Importar configuración de multer
const {
    crearPelicula,
    obtenerPeliculas,
    obtenerPeliculaPorId,
    actualizarPelicula,
    eliminarPelicula,
} = require('../controllers/peliculaController');

// Rutas para películas.
router.post('/', upload.single('portada'), crearPelicula); // Para crear
router.get('/', obtenerPeliculas);
router.get('/:id', obtenerPeliculaPorId);
router.put('/:id', upload.single('portada'), actualizarPelicula); // Agregar multer aquí para actualizar
router.delete('/:id', eliminarPelicula);

module.exports = router;