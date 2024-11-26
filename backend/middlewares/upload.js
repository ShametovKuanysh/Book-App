// const multer = require('multer');
// const path = require('path');

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + file.originalname);
//     },
// })

// const upload = multer({ storage });

const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dvnghun9q', // Замените вашим Cloud Name
    api_key: '245913617943777', // Замените вашим API Key
    api_secret: 'w6f0a8IMbJBFQNGbswt5Z1xwyjo', // Замените вашим API Secret
});

// Настройка хранилища для Multer
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'books', // Папка, куда будут сохраняться файлы
        format: async (req, file) => 'txt', // Устанавливаем формат файла (опционально)
        public_id: (req, file) => file.originalname.split('.')[0], // Уникальный идентификатор (опционально)
    },
});

const upload = multer({ storage });

export default upload