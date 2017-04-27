const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);


app.get('/', function(req, res){
    res.send('');
});

io.on('connection', (socket) => {
    io.emit('message', 'user joined');

    socket.on('message', (msg) => {
        console.log(msg);
        io.emit('message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

server.listen(3000, function(){
  console.log('listening on *:3000');
});