
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: 'dvnghun9q', // Замените вашим Cloud Name
    api_key: '245913617943777', // Замените вашим API Key
    api_secret: 'w6f0a8IMbJBFQNGbswt5Z1xwyjo', // Замените вашим API Secret
});

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: 'books',
        format: async (req, file) => 'txt',
        public_id: (req, file) => file.originalname.split('.')[0], 
    },
});

const upload = multer({ storage });

module.exports = upload