$('img.card-img').hover(function(){
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
