const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

users = [];
connections = [];

server.listen(process.env.PORT || 3000);

app.get('/', () => {
});

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log(connections.length);
});