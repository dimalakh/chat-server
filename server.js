const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const passport = require('passport');
const mongoose = require('mongoose');
const mongo = require('mongodb');

mongoose.connect('mongodb://localhost/chat');
const db = mongoose.connection;


const routes = require('./routes/index');
const auth = require('./routes/auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressValidator());

app.use('/', routes);
app.use('/auth', auth);

app.set('port', 3000);

app.listen(app.get('port'), () => {
    console.log(`server is running on localhost:${app.get('port')}`)
});