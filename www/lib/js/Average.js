var Average = function() {
  arr = [];
  this.add = function(num) {
    if (Array.isArray(num)) {
      for (var i in num) {
        arr.push(num[i]);
      }
      return this.average();
    } else {
      arr.push(num);
      return this.average();
    }
  };

  this.shift = function() {
    arr.shift();
    return this.average();
  };

  this.average = function(num) {
    var total = 0;
    for (i = (num && arr.length - num >= 0 ? arr.length - num : 0); i < arr.length; i++) {
      total += arr[i] || 0;
    }
    return total / (num  && num <= arr.length ? num : arr.length);
  };
};
