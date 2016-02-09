#!/usr/bin/env node
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var port = process.env.PORT || 3000;

console.log('Listening on port: ' + port);

server.listen(port);

io.on('connection', function(socket) {

  socket.on('user', function(data) {
    //find user, then return if running...
  });

  socket.on('status', function(data) {
    //check that the id is correct, then update their song
  });
});
