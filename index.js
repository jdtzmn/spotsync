#!/usr/bin/env node
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var request = require('request');
var fs = require('fs');
var port = process.env.PORT ? process.env.PORT : 3000;
var secrets = {};
fs.readFile('./secrets.js', function(err, data) {
  if (err) {
    secrets = {
      spotify_id: process.env.SPOTIFY_ID,
      spotify_secret: process.env.SPOTIFY_SECRET
    };
  } else {
    secrets = JSON.parse(data);
  }
});

app.use(express.static(__dirname + '/www/dist'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/www/index.html');
});

app.get('/login', function(req, res) {
  res.redirect('https://accounts.spotify.com/authorize?response_type=code&show_dialog=true&client_id=' +
  secrets.spotify_id +
  '&scope=' + encodeURIComponent('user-follow-read') + '&redirect_uri=' + encodeURIComponent('https://streamwithspotsync.herokuapp.com'));
});

app.get('/token', function(req, res) {
  request.post({
    url: 'https://accounts.spotify.com/api/token',
    form: {
      grant_type: 'authorization_code',
      code: req.query.code,
      redirect_uri: encodeURIComponent('https://streamwithspotsync.herokuapp.com')
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
    } else if (response.statusCode == 200) {
      res.send(body);
    }
  });
});

var users = [];

io.use(function(socket, next){
    if (socket.handshake.query.access_token) {
      request({
        url: 'https://api.spotify.com/v1/me',
        headers: {
          'Authorization': 'Bearer ' + socket.handshake.query.access_token
        }
      }, function(err, response, body) {
        if (err) {
          console.log(err);
        } else if (response.statusCode == 200) {
          socket.usr = JSON.parse(body);
          return next();
        }
      });
    }

    next(new Error('Authentication error'));
});

io.on('connection', function(socket) {

  socket.usr.socket_id = socket.id;
  users.push(socket.usr);
  socket.broadcast.emit('connection');

  socket.on('users', function() {
    var usrs = [];
    for (var i in users) {
      if (users[i].playing && users[i] !== socket.usr) usrs.push(users[i]);
    }
    socket.emit('users', usrs);
  });

  socket.on('status', function(data, cb) {
    var i, ii;
    if (typeof data === 'string') data = [data];
    var usrs = [];
    for (i in data) {
      for (ii in users) {
        if (users[ii].socket_id === data[i] && users[ii].playing) {
          usrs.push(users[ii]);
        }
      }
    }
    if (!cb) socket.emit('status', usrs);
    var obj = {};
    for (ii in data) {
      for (ii in users) {
        if (users[ii].socket_id === data[i]) {
          obj[users[ii].socket_id] = false;
          io.sockets.connected[users[ii].socket_id].emit('update', function(id) {
            if (typeof id === 'object') {
              if (cb) cb([id]);
              return;
            }
            obj[id] = true;
          });
        }
      }
    }

    var count = 0;
    var interval = setInterval(function() {
      count += 1;
      if (count >= 5) {
        clearInterval(interval);
      }
      for (i in obj) {
        if (!obj[i]) return;
      }
      var usrs = [];
      for (i in data) {
        for (ii in users) {
          if (users[ii].socket_id === data[i] && users[ii].playing) {
            usrs.push(users[ii]);
          }
        }
      }
      if (!cb) socket.emit('status', usrs);
      if (cb) cb(usrs);
      clearInterval(interval);
    }, 1000);
  });

  socket.on('update', function(data) {
    var changed = socket.usr.playing ? JSON.parse(JSON.stringify(socket.usr.playing)) : false;
    if (data === 'false') {
      socket.usr.playing = false;
    } else {
      socket.usr.playing = data.playing;
      socket.usr.track = data.track.track_resource;
      socket.usr.track.length = data.track.length;
      socket.usr.playing_position = data.playing_position;
      socket.usr.from = data.from;
    }
    changed = changed !== socket.usr.playing;
    var usrs = [];
    for (var i in users) {
      if (socket.id === users[i].id) users[i] = socket.usr;
      if (users[i].playing) usrs.push(users[i]);
    }
    if (changed) {
      socket.broadcast.emit('users');
    }
  });

  socket.on('disconnect', function() {
    var index = users.indexOf(socket.usr);
    if (index > -1) users.splice(index, 1);
    socket.broadcast.emit('connection');
  });
});

server.listen(port);
console.log('Listening on port: ' + port);
