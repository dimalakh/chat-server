const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const router = express.Router();

const User = require('../models/user'); 

router.get('/signup', (req, res) => {
    res.send('signup');
});

router.get('/login', (req, res) => {
    res.send('login');
});

router.post('/signup', (req, res) => {
    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    req.checkBody('username', 'name is required').notEmpty();
    req.checkBody('email', 'must be an email').isEmail();
    req.checkBody('password', 'must be an email').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        console.log('errors' + errors);
    } else {
        const newUser = new User({
            'username': name,
            'password': password,
            'email': email
        });

        User.createUser(newUser, (err, user) => {
            if(err) throw err;
            console.log(user);
        });
    }
});

//login
passport.use(new LocalStrategy(
  (username, password, done) => {
      User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user) {
            return done(null, false, {'message': 'unknown user'});
        }
        
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {'message': 'incorrect password'});
            }
        });
      });
  }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((user, done) => {
    User.getUserById(id, (err, done) => {
        done(err, user);
    });
});

router.post('/login', passport.authenticate('local'), (req, res) => {
    res.send(req.user);
});

module.exports = router;