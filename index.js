#!/usr/bin/env node
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/www/dist'));

console.log('Listening on port: 3000');

function room() {
  var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

app.get('/', function(req, res) {
  res.redirect('/' + room());
});

app.get('/:room', function(req, res) {
  if (req.params.room.length !== 5) {
    res.redirect('/' + room());
  } else {
    res.sendFile(__dirname + '/www/index.html');
  }
});

server.listen(3000);

io.on('connection', function(socket) {

  socket.on('room', function(data) {
    socket.join(data);
    var room = io.sockets.adapter.rooms[data];

    if (room.length < 2) {
      socket.emit('first');
    }
  });

  socket.on('play', function(data) {
    var roomname = Object.keys(io.sockets.adapter.sids[socket.id])[1];
    socket.broadcast.to(roomname).emit('play', data);
  });

  socket.on('status', function() {
    var roomname = Object.keys(io.sockets.adapter.sids[socket.id])[1];
    socket.broadcast.to(roomname).emit('status');
  });
});
