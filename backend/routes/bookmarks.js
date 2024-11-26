const express = require('express');

const router = express.Router();
const { Bookmark, Book } = require('../models');
const auth = require('../middlewares/auth')

router.post('/', auth.checkUser, async (req, res) => {
    try {
        const { page, note, bookId } = req.body

        const bookmark = await Bookmark.create({
            page,
            note,
            bookId,
            userId: req.user.userId,
        })

        res.status(201).json(bookmark);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

router.delete('/:id', auth.checkUser, async (req, res) => {
    try {
        const bookmark = await Bookmark.findByPk(req.params.id)

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        await bookmark.destroy();

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

router.patch('/:id', auth.checkUser, async (req, res) => {
    try {
        const bookmark = await Bookmark.findByPk(req.params.id)

        if (!bookmark) {
            return res.status(404).json({ message: 'Bookmark not found' });
        }

        const { note, page } = req.body;

        await bookmark.update({ note: note, page: page});

        res.status(204).send(bookmark);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

router.get('/:id', auth.checkUser, async (req, res) => {
    try {
        const userId = req.params.id;

        const where = {};
        if (userId) {
            where.userId = userId;
        }

        const bookmarks = await Bookmark.findAll({ where,
            include: [
                {
                  model: Book,
                  attributes: ['title', 'author'],
                },
            ]
         })

        res.json(bookmarks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error on server' });
    }
})

module.exports = router;
