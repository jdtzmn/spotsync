var play = {
  format: function(num) {
    return Math.floor(num / 60) + ':' + '0'.substring(0, 2 - JSON.stringify(num % 60).length) + num % 60;
  },
  time: function() {
    return new Date().getTime();
  },
  user: function(id) {
    socket.emit('status', id, function(status) {
      console.log(status);
    });
  },
  track: function(id, from, cb) {

  },
  playing: function(id, from) {

  }
};
