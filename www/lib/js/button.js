var spotify;
interval = null;
$(document).ready(function() {
  $('.fa-play').click(function() {
    if ($('.fa-play').hasClass('fa-pause')) {
      $('.fa-play').removeClass('fa-pause');
      player.mute = true;
    }

    if ($('.fa-play').hasClass('fa-microphone')) {
      if ($('.fa-microphone').hasClass('bounce')) {
        $('.fa-microphone').removeClass('bounce infinite');
      } else if ($('.fa-stack').hasClass('text-danger')) {
        clearInterval(interval);
        $('.fa-stack').removeClass('text-danger');
        $('.fa-microphone').addClass('fa-microphone-slash');
        player.mute = true;
        return;
      }

      $('.fa-microphone-slash').removeClass('fa-microphone-slash');
      $('.fa-stack').addClass('text-danger');
      $('.fa-stack').fadeOut().delay(100).fadeIn();
      player.mute = false;

      clearInterval(interval);
      interval = setInterval(function() {
        $('.fa-stack').fadeOut().delay(100).fadeIn();
      }, 3000);
    } else {
      $('.fa-play').addClass('fa-pause');
      player.mute = false;
      socket.emit('status');
    }
  });

  $('#csrf').keyup(function() {
    var value = $('#csrf').val();
    Spotify.start(value, function(ok, instance, msg) {
      if (ok) {
        window.localStorage.setItem('csrf', value);
        document.location.reload(true);
      } else {
        $('#csrf').parent().parent().addClass('has-error');
      }
    });
  });
});
