const express = require('express');
const router = express.Router();

const User = require('../models/user'); 

router.get('/signup', (req, res) => {
    res.send('signup');
});

router.post('/signup', (req, res) => {
    res.send('signup');
});

router.get('/login', (req, res) => {
    res.send('login');
});

router.post('/login', (req, res) => {
    res.send('login');
});

module.exports = router;