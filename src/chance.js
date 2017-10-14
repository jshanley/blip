let chance = function(p) {
  let attempt = Math.random();
  return attempt < p;
}

export default chance;
