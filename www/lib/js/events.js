$(document).ready(function() {

  //window resize event:
  $('body').removeAttr('style').css('padding-bottom', $('.navbar-fixed-bottom').height() + 18).css('padding-top', $('.navbar-fixed-top').height() + 30);
  $(window).resize(function() {
    $('body').removeAttr('style').css('padding-bottom', $('.navbar-fixed-bottom').height() + 18).css('padding-top', $('.navbar-fixed-top').height() + 30);
  });

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
    if ($(this).hasClass('friends')) {
      window.sessionStorage.setItem('tab', 'friends');
    } else {
      window.sessionStorage.setItem('tab', 'explore');
    }
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
    var t = this;
    socket.emit('users');
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
      window.sessionStorage.removeItem('streaming');
      $('.stream-sm').removeClass('pulse');
      socket.emit('update', 'false');
      spotify.on('play');
    } else if (play.user_id !== '') {
      alert("You can't stream while listening to a stream!");
    } else {
      spotify.status(function(data) {
        if (!data.playing) {
          alert('You must be playing music to start streaming!');
        } else {
          window.sessionStorage.setItem('streaming', true);
          $('.stream-sm').addClass('pulse');
          data.from = play.time();
          socket.emit('update', data);
          spotify.on('play, pause', function(d) {
            if (!d.playing) {
              if (confirm('Pausing will stop your stream.')) {
                $('.stream-sm').removeClass('pulse');
                socket.emit('update', 'false');
                spotify.on('play');
              } else {
                spotify.play();
              }
            }
          });
        }
      });
    }
  });

  //search event:
  $('input.search-value').keyup(function() {
    search($('input.search-value').val());
    $('.nav-link').removeClass('active');
    window.sessionStorage.removeItem('tab');
  });

});
