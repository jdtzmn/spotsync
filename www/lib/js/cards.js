var cards = {
  show: function(instant, data, cb) {
    if (typeof instant === 'function') cb = instant;
    if (typeof data === 'function') cb = data;
    if (data === null || data.length === 0) {
        if ($('.nav-link.friends').hasClass('active')) {
          return $('.no-users').find('h1').text('No friends are currently streaming').parent().fadeIn();
        } else {
          return $('.no-users').find('h1').text('No users are currently streaming').parent().fadeIn();
        }
    } else {
      if ($('.no-users').is(':visible')) {
        return $('.no-users').fadeOut(function() {
          cards.show(instant, data, cb);
        });
      }
    }

    if (data && typeof data !== 'function') {
      var directives = {
        id: {
          text: function(params) {
            if (this.display_name === null) {
              $(params.element).css('margin-bottom', '29px');
            }
            return this.id;
          }
        },
        display_name: {
          text: function(params) {
            if (this.display_name !== null) {
              return this.display_name;
            } else {
              return '';
            }
          }
        },
        icon: {
          src: function(params) {
            if (this.images.length >= 1) {
              return this.images[0].url;
            }
          }
        },
        card: {
          'data-id': function(params) {
            return this.socket_id;
          }
        }
      };

      $('.users').render(data, directives);
    }

    if (instant) return $('.card').css('opacity', 1);

    $('img.card-img').hover(function(){
      socket.emit('status', $(this).parent().parent().attr('data-id'));
      $(this).stop().animate({opacity: 0}, 400);
      if (!$('.stream-sm').hasClass('pulse')) $(this).parent().parent().find('.overlay').stop().fadeIn();
      $(this).parent().find('.song_name').stop().fadeIn(function() {
        $(this).marquee();
      });
    }, function() {
      $(this).stop().animate({opacity: 1}, 400);
      $(this).parent().parent().find('.overlay').stop().fadeOut();
      $(this).parent().find('.song_name').stop().animate({scrollLeft: 0}, 0).fadeOut(function() {
        $(this).css('opacity', 1);
      }).css('opacity', 0);
    });

    function animateTopRow() {
      $('.card').filter(function() {
        return $(this).offset().top == $('.card').filter(function() {
          return $(this).css('opacity') == '0';
        }).offset().top;
      }).removeAttr('style').animateCss('flipInX');
      if ($('.card').filter(function() {return $(this).css('opacity') == '0';}).length > 0) {
        setTimeout(function() {
          animateTopRow();
        }, 60);
      } else {
        if (cb) cb();
      }
    }
    animateTopRow();
  },
  hide: function(instant, cb) {
    if (instant) {
      $('.no-users').hide();
      $('.card').css('opacity', 0);
      $('.card').hide();
      if (cb) cb();
    } else {
      $('.no-users:visible').fadeOut(function() {
        if (cb) cb();
      });
      $('.card:visible').fadeOut(function() {
        $(this).css('opacity', 0);
        if (cb) cb();
      });
      if (!$('.no-users').is(':visible') && !$('.card').is(':visible')) {
        if (cb) cb();
      }
    }
  }
};

$.fn.extend({
    animateCss: function(animationName, cb) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (cb) cb();
        });
    }
});
