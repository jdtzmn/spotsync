var me = {};
var spotify = {};
$(document).ready(function() {
  if (window.localStorage.getItem('csrf') === null || window.localStorage.getItem('refresh_token') === null) {
    $(document).ready(function() {
      $('.csrf').fadeIn();
      $('#csrf').focus();
    });
  } else {
    cards.hide(true);
    $('.main').fadeIn();
    $('body').scrollTop(0);
  }
  if (window.localStorage.getItem('refresh_token') !== null) {
    $.ajax({
      url: '/refresh?refresh_token=' + window.localStorage.getItem('refresh_token'),
      success: function(res) {
        var data = JSON.parse(res);
        socket(data.access_token, function() {
          $.ajax({
            url: 'https://api.spotify.com/v1/me',
            headers: {
              Authorization: 'Bearer ' + data.access_token
            },
            success: function(res) {
              me = res;
              if (res.images.length >= 1) {
                $('.user-icon').fadeOut(function() {
                  $('.user-icon').attr('src', res.images[0].url).fadeIn();
                });
              }
            }
          });
        });
      }
    });
  }
  if (query.csrf || window.localStorage.getItem('csrf') !== null) {
    $('#csrf').hide();
    $('.csrftut').hide();
    $('.form-control-label').hide();
    $('.auth').fadeIn();
    $('.form-control-label').text('Sign In:').fadeIn();
    $('.auth').mousedown(function(e) {
      window.location.replace('/login');
    });

    var csrf = window.localStorage.getItem('csrf') !== null ? window.localStorage.getItem('csrf') : query.csrf;
    spotify = new Spotify(csrf);
    spotify.ready(function(err) {
      if (err) {
        console.log(err);
        $('.auth').animate({ width: 'hide' }, function() {
          $('#csrf').animate({ width: 'show' }, function() {
            $('.csrftut').fadeIn();
            $('.form-control-label').fadeOut(function() {
              $(this).text('CSRF:').fadeIn();
            });
          });
        });
      } else {
        window.localStorage.setItem('csrf', csrf);
        if (window.localStorage.getItem('refresh_token') !== null) {
          $('.csrf').fadeOut();
          $('.main').fadeIn();
          if (window.sessionStorage.getItem('streaming') !== null) {
            $('.nav-link.stream').click();
          }
        } else {
          if ($('.form-control-label').text() !== 'Sign In:') {
            $('#csrf').animate({ width: 'hide' }, function() {
              $('.csrftut').fadeOut();
              $('.auth').animate({ width: 'show' }, function() {
                $('.form-control-label').fadeOut(function() {
                  $(this).text('Sign In:').fadeIn();
                });
                $('.auth').mousedown(function(e) {
                  window.location.replace('/login');
                });
              });
            });
          }
        }
      }
    });
  }

  $('#csrf').on('paste keyup', function(e) {
    if (e.keyCode === 8 || $('#csrf').val() === '') {
      return;
    }
    var csrf = $('#csrf').val();
    spotify = new Spotify(csrf);
    spotify.ready(function(err) {
      if (err) {
        console.log(err);
        $('#csrf').parent().parent().addClass('has-error');
        $('#csrf').animateCss('shake');
      } else {
        $('#csrf').parent().parent().removeClass('has-error');
        window.localStorage.setItem('csrf', csrf);
        if (window.localStorage.getItem('refresh_token') !== null) {
          $.ajax({
            url: '/refresh?refresh_token=' + window.localStorage.getItem('refresh_token'),
            success: function(res) {
              var data = JSON.parse(res);
              $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  Authorization: 'Bearer ' + data.access_token
                },
                success: function(res) {
                  $('.csrftut').fadeOut();
                  $('.csrf').fadeOut(function() {
                    $('.main').fadeIn();
                    $('body').removeAttr('style').css('padding-bottom', $('.navbar-fixed-bottom').height() + 18).css('padding-top', $('.navbar-fixed-top').height() + 30);
                    cards.show();
                  });
                  console.log(res);
                }
              });
            }
          });
        } else {
          if ($('.form-control-label').text() !== 'Sign In:') {
            $('.csrftut').fadeOut();
            $('#csrf').animate({ width: 'hide' }, function() {
              $('.auth').animate({ width: 'show' }, function() {
                $('.form-control-label').fadeOut(function() {
                  $(this).text('Sign In:').fadeIn();
                });
                $('.auth').mousedown(function(e) {
                  window.location.replace('/login');
                });
              });
            });
          }
        }
      }
    });
  });
});

function modalCsrf() {
  $('.modal-csrf').on('paste keyup', function(e) {
    if (e.keyCode === 8 || $('.modal-csrf').val() === '') {
      return;
    }
    var csrf = $('.modal-csrf').val();
    spotify = new Spotify(csrf);
    spotify.ready(function(err) {
      if (err) {
        console.log(err);
        $('.modal-csrf').parent().parent().addClass('has-error');
        $('.modal-csrf').animateCss('shake');
      } else {
        $('.modal').modal('hide');
        $('.modal-csrf').parent().parent().removeClass('has-error');
        window.localStorage.setItem('csrf', csrf);
        if (window.localStorage.getItem('refresh_token') !== null) {
          $.ajax({
            url: '/refresh?refresh_token=' + window.localStorage.getItem('refresh_token'),
            success: function(res) {
              var data = JSON.parse(res);
              $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  Authorization: 'Bearer ' + data.access_token
                },
                success: function(res) {
                  $('.csrftut').fadeOut();
                  $('.csrf').fadeOut(function() {
                    $('.main').fadeIn();
                    $('body').removeAttr('style').css('padding-bottom', $('.navbar-fixed-bottom').height() + 18).css('padding-top', $('.navbar-fixed-top').height() + 30);
                    cards.show();
                  });
                  console.log(res);
                }
              });
            }
          });
        } else {
          if ($('.form-control-label').text() !== 'Sign In:') {
            $('.csrftut').fadeOut();
            $('#csrf').animate({ width: 'hide' }, function() {
              $('.auth').animate({ width: 'show' }, function() {
                $('.form-control-label').fadeOut(function() {
                  $(this).text('Sign In:').fadeIn();
                });
                $('.auth').mousedown(function(e) {
                  window.location.replace('/login');
                });
              });
            });
          }
        }
      }
    });
  });
}
