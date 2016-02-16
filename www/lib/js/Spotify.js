var Spotify = function(csrf) {

  var jquery = typeof jQuery !== 'undefined' ? true : false;

  //general request functions:

  var port = 4371;
  var token = '';
  var done = false;

  var request = function(path, cb) {
    var id = function() {
      return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 10) + '.';
    };

    if (jquery) {
      var options = {
        url: 'https://' + id() + 'spotilocal.com:' + port + path,
        error: function(xhr, status) {
          if (cb) cb(status);
        },
        success: function(response) {
          var data = response;
          if (cb) cb(data);
        }
      };

      $.get(options);
    } else {
      var req = new XMLHttpRequest();
      req.open('GET', 'https://' + id() + 'spotilocal.com:' + port + path, true);

      req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
          var data = JSON.parse(req.responseText);
          if (cb) cb(data);
        } else {
          if (cb) cb('error');
        }
      };

      req.onerror = function() {
        if (cb) cb('error');
      };

      req.send();
    }
  };

  //custom functions:

  this.ready = function ready(cb) {

    if (done) {
      if (cb) cb();
      return true;
    }

    request('/service/version.json?service=remote', function(response) {
      if (response === 'error' && port < 4380) {
        port += 1;
        ready(cb);
      } else if (response === 'error' && port >= 4380) {
        if (cb) cb("Spotify application is not running or doesn't support the internal web server.");
      } else {

        if (jquery) {
          $.ajax({
            url: 'https://jsonp.afeld.me/?url=https://open.spotify.com/token',
            method: 'GET',
            success: function(response) {
              token = response.t;
              request('/remote/status.json?csrf=' + csrf + '&oauth=' + token, function(response) {
                if (typeof response.error !== 'undefined' && response.error.type === "4107") {
                  if (cb) cb('invalid CSRF token');
                } else {
                  if (cb) cb();
                  done = true;
                }
              });
            }
          });
        } else {
          var req = new XMLHttpRequest();
          req.open('GET', 'https://jsonp.afeld.me/?url=https://open.spotify.com/token', true);

          req.onload = function() {
            if (req.status >= 200 && req.status < 400) {
              var data = JSON.parse(req.responseText);
              token = data.t;
              request('/remote/status.json?csrf=' + csrf + '&oauth=' + token, function(response) {
                if (typeof response.error !== 'undefined' && response.error.type === "4107") {
                  if (cb) cb('invalid CSRF token');
                } else {
                  if (cb) cb();
                  done = true;
                }
              });
            } else {
              if (cb) cb('error');
            }
          };

          req.onerror = function() {
            if (cb) cb('error');
          };

          req.send();
        }

      }
    });
  };

  this.status = function status(cb) {
    request('/remote/status.json?csrf=' + csrf + '&oauth=' + token, function(response) {
      if (cb) cb(response);
    });
  };

  this.play = function play(uri, cb) {
    if (!uri || typeof uri !== 'string') {
      if (cb) cb(new Error('uri is needed in order to play song.'));
    } else {
      request('/remote/play.json?csrf=' + csrf + '&oauth=' + token + '&uri=' + uri, function(response) {
        if (cb) cb(response);
      });
    }
  };

  this.toggle = function toggle(cb) {
    this.status(function(data) {
      request('/remote/pause.json?csrf=' + csrf + '&oauth=' + token + '&pause=' + data.playing, function(response) {
        if (cb) cb(response);
      });
    });
  };

  this.pause = function pause(cb) {
    request('/remote/pause.json?csrf=' + csrf + '&oauth=' + token + '&pause=true', function(response) {
      if (cb) cb(response);
    });
  };
};
