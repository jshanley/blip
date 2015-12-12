let random = function(a,b) {
  switch(arguments.length) {
    case 0:
      return Math.random();
    case 1:
      return Math.random() * a;
    case 2:
      return Math.random() * (b - a) + a;
  }
}

export default random;
