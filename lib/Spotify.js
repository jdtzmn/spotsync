#!/usr/bin/env node
var https = require('https');

var Spotify = function(cb) {

  //general request functions:

  var port = 4370;
  var csrf = '';
  var token = '';

  var request = function(path, cb) {
    var id = function() {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10) + '.';
    };

    var options = {
      hostname: id() + 'spotilocal.com',
      port: port,
      path: path,
      method: 'GET',
      rejectUnauthorized: false,
      headers: {
        'Origin': 'https://embed.spotify.com'
      }
    };

    var req = https.request(options, function(res) {
      var response = '';
      res.on('data', function(d) {
        response += d;
      });

      res.on('end', function() {
        var data = JSON.parse(response);
        cb(data);
      });
    });
    req.end();

    req.on('error', function(err) {
      cb(err);
    });
  };

  //custom functions:

  this.ready = function ready(open, cb) {

    if (typeof open === 'function') cb = open;

    if (port >= 4379) return new Error('spotify web helper not running.');

    request('/service/version.json?service=remote', function(response) {
      if (response.code === 'ECONNREFUSED' && port < 4380) {
        port += 1;
        ready(cb);
      } else {

        request('/simplecsrf/token.json', function(response) {
          csrf = response.token;

          var req = https.request({
            hostname: 'open.spotify.com',
            method: 'GET',
            path: '/token'
          }, function(res) {
            var response = '';
            res.on('data', function(d) {
              response += d;
            });

            res.on('end', function() {
              var data = JSON.parse(response);
              token = data.t;
              if (open === true) {
                request('/remote/open.json', function(response) {
                  cb();
                });
              } else {
                cb();
              }
            });
          });
          req.end();

          req.on('error', function(e) {
            cb(e);
          });

        });
      }
    });
  };

  this.open = function open(cb) {
    request('/remote/open.json', function() {
      cb();
    });
  };

  this.status = function status(cb) {
    request('/remote/status.json?csrf=' + csrf + '&oauth=' + token, function(response) {
      cb(response);
    });
  };

  this.play = function play(uri, cb) {
    if (!uri || typeof uri !== 'string') {
      cb(new Error('uri is needed in order to play song.'));
    } else {
      request('/remote/play.json?csrf=' + csrf + '&oauth=' + token + '&uri=' + uri, function(response) {
        cb(response);
      });
    }
  };

  this.toggle = function toggle(cb) {
    this.status(function(data) {
      request('/remote/pause.json?csrf=' + csrf + '&oauth=' + token + '&pause=' + data.playing, function(response) {
        cb(response);
      });
    });
  };

  this.pause = function pause(cb) {
    request('/remote/pause.json?csrf=' + csrf + '&oauth=' + token + '&pause=true', function(response) {
      cb(response);
    });
  };
};

module.exports = Spotify;
