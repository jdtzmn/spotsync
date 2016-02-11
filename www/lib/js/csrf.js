$(document).ready(function() {
  if (query.csrf) {
    var spotify = new Spotify(query.csrf);
    spotify.ready(function(err) {
      if (err) return console.error(err);
      $('.form-control-label').fadeOut(function() {
        $(this).text('Sign In:').fadeIn();
      });
    });
  }
});
