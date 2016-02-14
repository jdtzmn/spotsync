var cards = {
  show: function(instant, data, cb) {
    if (typeof instant === 'function') cb = instant;
    if (typeof data === 'function') cb = data;
    if (data === null || data.length === 0) {
      $('.users').hide();
      return $('.no-users').fadeIn();
    }
    if (instant) return $('.card').removeAttr('style').css('opacity', 1);

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
        }
      };

      $('.users').render(data, directives);
    }

    $('img.card-img.icon').hover(function(){
      $(this).stop(true,true).animate({opacity: 0}, 400);
      $(this).parent().removeAttr('style').css('background', "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('" + 'https://i.scdn.co/image/e34cbf5783a92faa387cbe97dbaa8376008718eb' + "')");
      $(this).parent().parent().find('.overlay').stop().fadeIn();
      $(this).parent().find('.song_name').stop().fadeIn(function() {
        $(this).marquee();
      });
    }, function() {
      $(this).stop(true,true).animate({opacity: 1}, 400);
      $(this).parent().parent().find('.overlay').stop().fadeOut();
      $(this).parent().find('.song_name').stop().animate({scrollLeft: 0}, 500).fadeOut(function() {
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
        cb();
      }
    }
    animateTopRow();
  },
  hide: function() {
    return $('.card').removeAttr('style').css('opacity', 0);
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
