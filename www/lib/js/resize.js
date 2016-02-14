$(document).ready(function() {
  $('body').removeAttr('style').css('padding-bottom', $('.navbar-fixed-bottom').height() + 18).css('padding-top', $('.navbar-fixed-top').height() + 30);
  $(window).resize(function() {
    $('body').removeAttr('style').css('padding-bottom', $('.navbar-fixed-bottom').height() + 18).css('padding-top', $('.navbar-fixed-top').height() + 30);
  });
});
