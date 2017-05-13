const express = require('express');
const bodyParser = require('body-parser');
const socketioJwt = require('socketio-jwt');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/chat');
const db = mongoose.connection;

const auth = require('./routes/auth.router');
const user = require('./routes/user.router');
const chat = require('./routes/chat.router');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('ok');
});

app.use('/auth', auth);
app.use('/user', user);
app.use('/chat', chat);

io.on('connection', socketioJwt.authorize({
    secret: 'secretKey',
    callback: false 
  }))
  .on('authenticated', (socket) => {
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });

    socket.on('new-chat', chat => {
      io.emit('new-chat', chat);
    })

    socket.on('join-room', room => {
      socket.join(room);
      io.emit('join-room', {
        user: socket.decoded_token,
        time: Date.now()
      });
    })

    console.log(socket.decoded_token);
  });

server.listen(3000, () => {
    console.log(`server is running on localhost:3000`)
});