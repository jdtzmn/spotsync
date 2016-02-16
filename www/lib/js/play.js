var play = {
  format: function(num) {
    return Math.floor(num / 60) + ':' + '0'.substring(0, 2 - JSON.stringify(num % 60).length) + num % 60;
  },
  user: function(id) {
    socket.emit('status', id);
  }
};
