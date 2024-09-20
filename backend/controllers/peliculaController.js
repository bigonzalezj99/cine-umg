const Pelicula = require('../models/peliculaModel');
const path = require('path');

// Crear una nueva película
const crearPelicula = async (req, res) => {
    try {
        const { titulo, genero, duracion, clasificacion, sinopsis, anio_estreno, director_id } = req.body;

        // Obtiene la ruta de la portada si existe
        const portada = req.file ? `/uploads/${req.file.filename}` : null; // Ajustar para que devuelva la ruta relativa

        const nuevaPelicula = await Pelicula.create({
            titulo,
            genero,
            duracion,
            clasificacion,
            sinopsis,
            anio_estreno,
            director_id,
            portada,
        });

        res.status(201).json(nuevaPelicula);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la película' });
    }
};

// Obtener todas las películas
const obtenerPeliculas = async (req, res) => {
    try {
        const peliculas = await Pelicula.findAll();
        res.status(200).json(peliculas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener las películas' });
    }
};

// Obtener una película por ID
const obtenerPeliculaPorId = async (req, res) => {
    const { id } = req.params;
    try {
        const pelicula = await Pelicula.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }
        res.status(200).json(pelicula);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la película' });
    }
};

// Actualizar una película
const actualizarPelicula = async (req, res) => {
    const { id } = req.params;

    // Obtener los datos del cuerpo de la solicitud
    const { titulo, genero, duracion, clasificacion, sinopsis, anio_estreno, director_id } = req.body;

    try {
        // Obtener la película existente
        const pelicula = await Pelicula.findByPk(id);
        if (!pelicula) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        // Crear un objeto de actualización
        const actualizacion = {
            titulo,
            genero,
            duracion,
            clasificacion,
            sinopsis,
            anio_estreno,
            director_id,
            portada: req.file ? `/uploads/${req.file.filename}` : pelicula.portada, // Actualizar si hay nueva imagen
        };

        // Actualizar la película en la base de datos
        await Pelicula.update(actualizacion, {
            where: { id },
        });

        // Retornar la película actualizada
        const peliculaActualizada = await Pelicula.findByPk(id);
        res.status(200).json(peliculaActualizada);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la película' });
    }
};

// Eliminar una película
const eliminarPelicula = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Pelicula.destroy({
            where: { id },
        });

        if (!deleted) {
            return res.status(404).json({ error: 'Película no encontrada' });
        }

        res.status(204).json();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar la película' });
    }
};

module.exports = {
    crearPelicula,
    obtenerPeliculas,
    obtenerPeliculaPorId,
    actualizarPelicula,
    eliminarPelicula,
};