var Spotify = function(csrf) {

  //general request functions:

  var port = 4370;
  var token = '';

  var request = function(path, cb) {
    var id = function() {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10) + '.';
    };

    var request = new XMLHttpRequest();
    request.open('GET', 'https://' + id() + 'spotilocal.com:' + port + path, true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        cb(data);
      } else {
        cb('error');
      }
    };

    request.onerror = function() {
      cb('error');
    };

    request.send();
  };

  //custom functions:

  this.ready = function ready(cb) {

    request('/service/version.json?service=remote', function(response) {
      if (response === 'error' && port < 4380) {
        if (port >= 4379) return new Error('spotify web helper not running.');
        port += 1;
        ready(cb);
      } else if (response === 'error' && port >= 4380) {
        cb("Spotify application is not running or doesn't support the internal web server.");
      } else {

        var request = new XMLHttpRequest();
        request.open('GET', 'https://jsonp.afeld.me/?url=https://open.spotify.com/token', true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            var data = JSON.parse(request.responseText);
            token = data.t;
            cb();
          } else {
            cb('error');
          }
        };

        request.onerror = function() {
          cb('error');
        };

        request.send();

      }
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
