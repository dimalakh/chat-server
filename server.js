const express = require('express');
const bodyParser = require('body-parser');
const socketioJwt = require('socketio-jwt');
const mongoose = require('mongoose');
const cors = require('cors')

mongoose.connect('mongodb://localhost/chat2');
const db = mongoose.connection;

const auth = require('./routes/auth.router');
const user = require('./routes/user.router');
const chat = require('./routes/chat.router');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const User = require('./models/user.model');
const Message = require('./models/message.model');
const Conversation = require('./models/conversation.model');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('ok');
});

app.use('/auth', auth);
app.use('/users', user);
app.use('/chat', chat);

io.on('connection', socketioJwt.authorize({
    secret: 'secretKey',
    callback: false 
  }))
  .on('authenticated', (socket) => {
    const userId = socket.decoded_token._doc._id;

    socket.on('join-chat', (member) => {
        User.findOne({ _id: userId }, { password: 0, email: 0, username: 0, conversations: 0 })
            .exec((err, user) => {
                user.online = true;
                user.save();
                io.sockets.emit('join-chat', user);
            });
    });

    socket.on('disconnect', () => {
        User.findOne({ _id: userId }, { password: 0, email: 0, username: 0, conversations: 0 })
            .exec((err, user) => {
                user.online = false;
                user.save();
                io.sockets.emit('disconnect-chat', user);
            });
    });

    socket.on('message', (messageObject) => {
        io.sockets.in(messageObject.conversationId).emit('message', messageObject);

        const newMessage = new Message ({
            msg: messageObject.msg,
            sender: socket.decoded_token._doc._id
        });

       Conversation.findOne({_id: messageObject.conversationId})
       .exec((err, conv) => {
            conv.messages.push(newMessage);
            conv.save();
        });
        
        newMessage.save((err, user) => {
            if (err) console.log(err);
        });
    });

    socket.on('join-room', room => {
      socket.join(room);
    });
  });

server.listen(3000, () => {
    console.log(`server is running on localhost:3000`)
});