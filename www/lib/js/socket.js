var socket = io.connect('/');

socket.emit('room', window.location.pathname.substr(1));

socket.on('first', function() {
  $('.fa-play').addClass('fa-microphone animated infinite bounce');
});

socket.on('play', function(d) {
  player.play(d, function() {
    console.log('yay');
  });
});
