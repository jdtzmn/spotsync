var socket = function(access_token) {
  socket = io('/', { query: 'access_token=' + access_token});
  socket.emit('users');

  socket.on('users', function(users) {
    cards.show(false, users);
  });

  socket.on('connection', function(user) {
    socket.emit('users');
  });

  socket.on('disconnect', function() {
    socket.emit('users');
  });
};
