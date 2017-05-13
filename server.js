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

const Message = require('./models/message.model');
const Conversation = require('./models/conversation.model');

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
    socket.on('message', (messageObject) => {
        io.emit('message', messageObject);

        const newMessage = new Message ({
            msg: messageObject.message
        });

        Conversation.findOne({_id: messageObject.chatId})
        .exec((err, conv) => {
            //console.log(data);
            conv.messages.push(newMessage);
            conv.save();
        });
        
        newMessage.save((err, user) => {
            if (err) console.log(err);
        });
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

  });

server.listen(3000, () => {
    console.log(`server is running on localhost:3000`)
});