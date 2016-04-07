function addScript(src) {
  var s = document.createElement('script');
  s.type = 'text/javascript';
  s.src = src;
  document.body.appendChild(s);
}
/*
 $(document).ready(function() {
  setTimeout(function() {
    addScript('//clksite.com/adServe/banners?tid=99486_163743_5&type=slider&side=right&size=120x600&position=center&close=disable');
    addScript('//clksite.com/adServe/banners?tid=99486_163743_4&type=slider&side=left&size=120x600&position=center&close=disable');
    addScript('https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.0/jquery.min.js');
  }, 500);
});
*/
