var streaming = false;
$(document).ready(function() {

  //.user-icon-dropdown hover icon:
  $('.user-icon').hover(function() {
    $('.user-icon-dropdown').stop().fadeIn();
  }, function() {
    $('.user-icon-dropdown').stop().fadeOut();
  });

  //.logout button event:
  $('.logout').click(function() {
    window.localStorage.removeItem('refresh_token');
    window.location.reload();
  });

  //.nav-link click event:
  $('.nav-link:not(.stream)').click(function() {
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    var t = this;
    cards.hide(false, function() {
        socket.emit('users');
    });
  });

  /* \/\/ This animation thanks to "Cogell" from Stack Overflow Question: http://stackoverflow.com/questions/12115833/adding-a-slide-effect-to-bootstrap-dropdown \/\/*/
    // ADD SLIDEDOWN ANIMATION TO DROPDOWN //
  $('.dropdown').on('show.bs.dropdown', function(e){
    $('h6.username').text(me.display_name ? me.display_name : me.id);
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
  });

  // ADD SLIDEUP ANIMATION TO DROPDOWN //
  $('.dropdown').on('hide.bs.dropdown', function(e){
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
  });
  /* /\/\ This animation thanks to "Cogell" from Stack Overflow Question: http://stackoverflow.com/questions/12115833/adding-a-slide-effect-to-bootstrap-dropdown /\/\ */

  //.nav-link.stream event:
  $('.nav-link.stream').click(function() {
    if ($('.stream-sm').hasClass('pulse')) {
      $('.stream-sm').removeClass('pulse');
      socket.emit('update', 'false');
    } else {
      spotify.status(function(data) {
        if (!data.playing) {
          alert('You must be playing music to start streaming!');
        } else {
          $('.stream-sm').addClass('pulse');
          data.from = play.time();
          socket.emit('update', data);
        }
      });
    }
  });

  $('img.icon').click(function() {

  });
});
