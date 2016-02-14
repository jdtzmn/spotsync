var cards = {
  show: function(instant) {
    if (instant) return $('.card').removeAttr('style').css('opacity', 1);
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
      }
    }
    animateTopRow();
  },
  hide: function() {
    return $('.card').removeAttr('style').css('opacity', 0);
  }
};

$.fn.extend({
    animateCss: function (animationName, cb) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        $(this).addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (cb) cb();
        });
    }
});
