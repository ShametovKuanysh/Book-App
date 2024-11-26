const express = require('express');
const router = express.Router();
const { User } = require('../models/index')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('./../middlewares/auth')

router.post('/register', async (req, res) => {
    try {
        const { username, password, email } = req.body;

        const user = await User.findOne( { where: {username: username}})

        if (user){
            res.status(400).json({ message: 'User with this username already exists' })
            return
        }

        const p = await bcrypt.hash(password,10)

        await User.create({
            username: username,
            password: p,
            email: email
        })

        res.status(201).json({ message: 'Success' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error on server' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        // console.log(req.body)

        const user = await User.findOne({ where: {username: username}})

        if (!user){
            return res.status(400).json({ message: 'User not found' })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // console.log(password. user.password)
        if (!isMatch){
            return res.status(400).json({ message: 'Invalid password' })
        }

        const token = jwt.sign({userId: user.id}, 'SECRET', { expiresIn: 1 * 60 * 60})

        res.status(201).json({ message: 'User logged in', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/me', auth.checkUser, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.userId, { attributes: ['username', 'email', 'id']});

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
})

router.put('/', auth.checkUser, async (req, res) => {
    try {
        const { username, email } = req.body;

        const user = await User.update({ username: username, email: email}, { where: { id: req.user.userId }});

        res.status(204).send(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/', auth.checkUser, async (req, res) => {
    try {
        await User.destroy({ where: { id: req.user.userId }});

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;
