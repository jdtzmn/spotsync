var player = {
  format: function(num) {
    return Math.floor(num / 60) + ':' + '0'.substring(0, 2 - JSON.stringify(num % 60).length) + num % 60;
  },
  play: function(track, cb) {
    if (!player.mute) {
      if (typeof track === 'function') {
        cb = track;
      }

      if ($('.fa-stack').hasClass('text-danger')) {
        spotify.status(1).done(function(d) {
          var date = new Date();
          d.time = date.getTime();
    			socket.emit('play', d);
    		});
      } else {
        var timer = new Timer();
        timer.start(track.time);
        spotify.status(1).done(function(d) {
          delay = timer.stop() / 1000;
          console.log('difference:' + difference((track.playing_position + delay), d.playing_position));
          if (d.playing  && difference(track.playing_position + delay, d.playing_position) > 0.25) {
            spotify.togglePause().done(function(d) {
              if (track.playing) {
                var uri = track.track.track_resource.uri + '#' + player.format(Math.round(track.playing_position + (timer.stop() / 1000)));
                spotify.play(uri).done(function(d) {
                  socket.emit('status');
                  cb(d);
                });
              }
            });
          } else {
            if (track.playing && difference(track.playing_position + delay, d.playing_position) > 0.1) {
              var uri = track.track.track_resource.uri + '#' + player.format(Math.round(track.playing_position + (timer.stop() / 1000)));
              spotify.play(uri).done(function(d) {
                socket.emit('status');
                cb(d);
              });
            } else {
              socket.emit('status');
            }
          }
        });
      }
    }
  },
  mute: true
};
