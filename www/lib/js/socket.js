var usrs = [];
var socket = function(access_token, cb) {
  socket = io('/', { query: 'access_token=' + access_token});
  cards.hide(true);

  //open previous open tab:
  if (window.sessionStorage.getItem('tab') !== null) {
    $('.nav-link.' + window.sessionStorage.getItem('tab')).click();
  }
  socket.emit('users');

  socket.on('users', function(users) {
    if (!users) return socket.emit('users');
    usrs = users;
    if ($('img.icon').filter(function() { return $(this).is(":hover"); }).length === 0) {
      if ($('.nav-link.friends').hasClass('active') && users.length > 0) {
        var ids = '';
        for (var i in users) {
          ids += users[i].id + ',';
        }
        ids = ids.slice(0, -1);
        $.ajax({
          url: 'https://api.spotify.com/v1/me/following/contains?type=user&ids=' + ids,
          headers: {
            Authorization: 'Bearer ' + access_token
          },
          success: function(res) {
            var arr = users.concat(res);
            var usrs = [];
            for (var i = users.length; i < arr.length; i++) {
              if (arr[i]) {
                usrs.push(arr[i - users.length]);
              }
            }
            $("html, body").stop().animate({scrollTop:0}, '500', 'swing');
            cards.show(false, usrs);
          },
          error: function(xhr, textStatus, err) {
            $("html, body").stop().animate({scrollTop:0}, '500', 'swing');
            cards.show(false, []);
          }
        });
      } else {
        $("html, body").stop().animate({scrollTop:0}, '500', 'swing');
        cards.show(false, users);
      }
    }
  });

  socket.on('status', function(data) {
    $.ajax({
      url: 'https://api.spotify.com/v1/tracks/' + data[0].track.uri.replace('spotify:track:', ''),
      success: function(res) {
        $('[data-id="' + data[0].socket_id + '"]').find('div.card-img-bg').css('background', "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('" + res.album.images[1].url + "')");
      }
    });
    if ($('[data-id="' + data[0].socket_id + '"]').find('.song_name').text() !== data[0].track.name) $('[data-id="' + data[0].socket_id + '"]').find('.song_name').text(data[0].track.name);
  });

  socket.on('update', function(cb) {
    if (spotify.ready()) {
      spotify.status(function(data) {
        data.from = play.time();
        socket.emit('update', data);
        if (cb) cb('/#' + socket.id);
      });
    }
  });

  socket.on('connection', function(user) {
    socket.emit('users');
  });

  socket.on('disconnect', function() {
    socket.emit('users');
  });
  cb();
};
