function Timer() {
  var begin, d;

  this.start = function(num) {
    if (num && typeof num === 'number') {
      begin = num;
    } else {
      d = new Date();
      begin = d.getTime();
    }
  };

  this.stop = function() {
    d = new Date();
    return d.getTime() - begin;
  };
}

var difference = function(a, b) {
  return Math.abs(a - b);
};
