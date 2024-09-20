const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

class Pelicula extends Model {}

Pelicula.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
    },
    titulo: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    genero: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    duracion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    clasificacion: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    sinopsis: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    anio_estreno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isInt: true,
            min: 1888,
            max: new Date().getFullYear(),
        },
    },
    director_id: {
        type: DataTypes.BIGINT,
        references: {
            model: 'directores',
            key: 'id',
        },
        allowNull: true,
    },
    portada: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Pelicula',
    tableName: 'peliculas',
    timestamps: false,
});

module.exports = Pelicula;