const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user.model'); 

router.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    newUser.save((err, user) => {
        if (err) res.send(err); 
        res.send(user);
    });
});

router.post('/login', (req, res) => {
    User.findOne({
        username: req.body.username
    }).exec((err, user) => {
        if (err) res.send(err);
        if (user === null) {
            res.sendStatus(404).send(404);
        } else {
            if (user.password === req.body.password) {
                const token = jwt.sign(user, 'secretKey', { noTimestamp: true })
                res.json({
                    user,
                    token,
                    tokenType: 'Bearer'
                });
            } else {
                res.send(401);
            }
        }
    });
});

module.exports = router;