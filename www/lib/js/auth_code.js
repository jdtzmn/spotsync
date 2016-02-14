var query = function() {
  var obj = {};
  if (window.location.href.split('?').length <= 1) return obj;
  var str = window.location.href.split('?')[1];
  var arr = str.split('&');
  for (var i in arr) {
    var split = arr[i].split('=');
    obj[split[0]] = split[1];
  }
  return obj;
}();


if (query.code) {
  $.ajax({
    url: '/token?code=' + query.code,
    success: function(res) {
      var data = JSON.parse(res);
      window.localStorage.setItem('refresh_token', data.refresh_token);
      window.location.replace(window.location.origin);
    }
  });
}
