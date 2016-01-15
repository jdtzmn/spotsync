var socket = io.connect('/');

socket.emit('room', window.location.pathname.substr(1));

socket.on('first', function() {
  $('.fa-play').addClass('fa-microphone animated infinite bounce');
});

socket.on('play', function(d) {
  player.play(d, function() {
    
  });
});

socket.on('status', function() {
  spotify.status(1).done(function(d) {
    var date = new Date();
    d.time = date.getTime();
    socket.emit('play', d);
  });
});
