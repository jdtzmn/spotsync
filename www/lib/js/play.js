var interval;
var amountOff = new Average();
var play = {
  user_id: '',
  format: function(num, from, round) {
    if (from) {
      var dif = (play.time() - from) / 1000;
      num += dif;
      if (round === 'ceil') num = Math.ceil(num);
      if (round === 'round') num = Math.round(num);
      if (round === 'floor') num = Math.floor(num);
      return Math.floor(num / 60) + ':' + '0'.substring(0, 2 - JSON.stringify(num % 60).split('.')[0].length) + num % 60;
    } else {
      return Math.floor(num / 60) + ':' + '0'.substring(0, 2 - JSON.stringify(num % 60).split('.')[0].length) + num % 60;
    }
  },
  time: function() {
    return new Date().getTime();
  },
  user: function(id, cb) {
    if (!id) {
      play.user_id = '';
      return;
    }
    socket.emit('status', id, function(d) {
      play.user_id = d[0].socket_id;
      var delay = Math.abs(1000 - amountOff.average(5) * 1000 - +(d[0].playing_position + ((play.time() - d[0].from) / 1000)) % 1 * 1000);
      setTimeout(function() {
        spotify.play(d[0].track.uri, play.format(d[0].playing_position, d[0].from, 'floor'), function(d) {
          if (cb) spotify.status(function(d) {
            cb(d);
          });
          spotify.on('login,logout,play,pause,ap', 3, function(d) {
            socket.emit('status', id, function(d) {
              play.playing(d[0].track.uri, d[0].playing_position, d[0].from, function(playing) {
                if (!playing) {
                  spotify.on('login,logout,play,pause,ap');
                  play.user(play.user_id, cb);
                }
              });
            });
          });
        });
      }, delay);
    });
  },
  track: function(uri, position, cb) {
    var timeoutDelay = (position % 1) * 1000;
    setTimeout(function() {
      var timer = play.time();
      spotify.play(uri, play.format(position, play.time(), 'ceil'), function(res) {
        var playDelay = (play.time() - timer) / 1000;
        var dif = ((play.time() + playDelay) - (timer + timeoutDelay)) / 1000;
        position += dif;
        timeoutDelay = (position % 1) * 1000;
        setTimeout(function() {
          spotify.play(uri, play.format(position + playDelay, play.time(), 'ceil'), function(res) {
            if (cb) cb(res);
          });
        }, timeoutDelay);
      });
    }, timeoutDelay);
  },
  playing: function(id, position, from, cb) {
    spotify.status(function(data) {
      if (data.playing === false) {
        if (cb) return cb(false);
      }
      console.log('streamer time: ' + position + (play.time() - from) / 1000);
      console.log('user time: ' + data.playing_position);
      console.log('amount off: ' + Math.abs(data.playing_position - ((position + (play.time() - from) / 1000) - 1)));
      amountOff.add(2 * Math.abs(data.playing_position - ((position + (play.time() - from) / 1000) - 1)));
      console.log('average amount off: ' + amountOff.average(5));
      if (data.track.track_resource.uri === id && Math.abs(data.playing_position - ((position + (play.time() - from) / 1000) - 1)) < 0.05) {
        if (cb) cb(true);
      } else {
        if (cb) cb(false);
      }
    });
  }
};
