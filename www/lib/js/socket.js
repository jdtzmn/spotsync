var socket = function(access_token) {
  socket = io('/', { query: 'access_token=' + access_token});
  socket.emit('users');

  socket.on('users', function(users) {
    console.log(users);
    cards.show(false, users, function() {
      alert('yay');
    });
  });
};
