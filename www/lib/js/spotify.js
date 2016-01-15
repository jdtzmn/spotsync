var spotify;
$(document).ready(function() {
  $('.csrf').fadeIn();
  if (window.localStorage.getItem('csrf') !== null) {
    Spotify.start(window.localStorage.getItem('csrf'), function(ok, instance, msg) {
      if (ok) {
        spotify = instance;
        $('.csrf').fadeOut();
        setTimeout(function() {
          $('.fa-stack').hide().fadeIn();
          $('.csrf').hide();
        }, 400);
      }
    });
  }
});
