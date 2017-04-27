const mongoose = require('mongoose');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


app.get('/', function(req, res){
    res.send('');
});

mongoose.connect('mongodb://localhost/test');

//shemas
const messageShema = { 
    chatId: Number,
    msg: String,
    time: Number 
}

const Message = mongoose.model('Message', messageShema);


io.on('connection', (socket) => {
    io.emit('message', 'user joined');

    socket.on('message', (msgText) => {
        const message = new Message({
            chatId: 1,
            msg: msgText,
            time: Date.now() 
        });

        message.save((err) => {
            if (err) {
                console.log(err);
            }
        });

        io.emit('message', msgText);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});