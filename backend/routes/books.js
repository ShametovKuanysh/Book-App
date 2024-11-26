const express = require('express');

const router = express.Router();
const { Book } = require('../models/index');
const auth = require('../middlewares/auth')
// const upload = require('../middlewares/upload')
// const { upload } = require('../firebase')

router.get('/', auth.checkUser, async (req, res) => {
    try {
        const books = await Book.findAll()

        res.json(books);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

router.get('/:id', auth.checkUser,  async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id)

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

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
    cloudinary: cloudinary,
    params: {
        asset_folder: 'books',
        resource_type: 'raw',
        // upload_preset: 'ml_default',
    },
});

const upload = multer({ storage });

// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//       cb(null, 'uploads/'); // Локальная папка для сохранения файлов
//     },
//     filename: (req, file, cb) => {
//       cb(null, Date.now() + '-' + file.originalname);
//     },
//   });
  
// const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        // console.log(JSON.stringify(req.file));
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // const [uploadedFile] = await bucket.upload(file.path, {
        //     destination: `books\${file.filename}`,
        //     publiec: true,
        // })

        const fileUrl = req.file.path;
        // console.log(fileUrl);
        res.json({
            message: 'File uploaded successfully!',
            fileUrl: req.file.path,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

router.post('/', auth.checkUser,  async (req, res) => {
    try {
        const { title, author, description, coverImage, fileUrl, fileType } = req.body;
        const book = await Book.create({
            title,
            author,
            description,
            coverImage,
            fileUrl,
            fileType
        });

        res.status(201).json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

router.delete('/:id', auth.checkUser,  async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id)

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        await book.destroy();

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

module.exports = router;
