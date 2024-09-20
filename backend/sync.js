const sequelize = require('./config/dbConfig');
const Pelicula = require('./models/Pelicula');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ force: false });  // Cambia a `true` solo si deseas reiniciar la base de datos
        console.log('Base de datos sincronizada correctamente.');
    } catch (error) {
        console.error('Error al sincronizar la base de datos:', error);
    }
};

syncDatabase();