const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Define la ruta de la carpeta uploads
const uploadsDir = path.join(__dirname, '../uploads');

// Asegúrate de que la carpeta uploads existe, si no, créala
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Crea la carpeta y cualquier carpeta padre necesaria
}

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Usa la ruta de la carpeta uploads
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Guarda con un nombre único
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limitar a 2MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Tipos de archivo permitidos
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: Tipo de archivo no permitido.'));
    }
});

module.exports = upload;