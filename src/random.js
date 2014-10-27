import "blip";

blip.chance = function(p) {
  var attempt = Math.random();
  return attempt < p;
};

blip.random = function(a,b) {
  switch(arguments.length) {
    case 0:
      return Math.random();
    case 1:
      return Math.random() * a;
    case 2:
      return Math.random() * (b - a) + a;
  }
};
