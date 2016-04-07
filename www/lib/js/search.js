var prevApplicable = [];
var search = function(q, cb) {
  var applicable = [];
  for (var i in usrs) {
    if (usrs[i].display_name && usrs[i].display_name.toLowerCase().indexOf(q) > -1 || usrs[i].id.toLowerCase().indexOf(q) > -1) {
      applicable.push(usrs[i]);
    }
  }
  if (!_.isEqual(applicable, prevApplicable)) {
    if (applicable.length > 0) {
      cards.show(false, applicable, function() {
        if (cb) cb();
      });
    } else {
      cards.hide(false);
    }
  }
  prevApplicable = applicable;
};
