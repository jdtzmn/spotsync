$.fn.marquee = function() {
  var text = $(this).html();
  $(this).html('<span>' + text + '</span>');
  var width = $(this).find('span:first').width();
  $(this).html(text);
  leftToRight(this, width);
  function leftToRight(t, w) {
    $(t).stop().animate({scrollLeft: w - 190}, 10 * w, function() {
      setTimeout(function() {
        $(t).animate({scrollLeft: 0}, 5 * w, function() {
          setTimeout(function() {
            leftToRight(t, w);
          });
        });
      }, 500);
    });
  }
};
