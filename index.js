#!/usr/bin/env node
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var request = require('request');
var secrets = require('./secrets.js');

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
  res.sendFile(__dirname + '/www/index.html');
});

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?response_type=code&client_id=' +
  secrets.spotify_id +
  '&redirect_uri=' + encodeURIComponent('http://localhost:3000'));
});

app.get('/token', function(req, res) {
  request.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: encodeURIComponent('http://localhost:3000')
    },
    headers: {
      'Authorization': 'Basic ' + new Buffer(secrets.spotify_id + ':' + secrets.spotify_secret).toString('base64')
    }
  }, function(err, response, body) {
    if (err) {
      res.send(err);
    } else if (!err && response.statusCode == 200) {
      res.send(body);
    }
  });
});

app.get('/refresh', function(req, res) {
  request.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'refresh_token',
      refresh_token: req.query.refresh_token
    },
    headers: {
      'Authorization': 'Basic ' + new Buffer(secrets.spotify_id + ':' + secrets.spotify_secret).toString('base64')
    }
  }, function(err, response, body) {
    if (err) {
      res.send(err);
    } else if (!err && response.statusCode == 200) {
      res.send(body);
    }
  });
});

io.use(function(socket, next){
    if (socket.handshake.query.access_token) {
      socket.username = socket.handshake.query.access_token;
      return next();
    }

    next(new Error('Authentication error'));
});

io.on('connection', function(socket) {

  socket.on('user', function(data) {
    //find user, then return if running...
  });

  socket.on('status', function(data) {
    //check that the id is correct, then update their song
  });
});

server.listen(3000);
