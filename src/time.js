import "context";

function now() {
  return ctx.currentTime;
}

blip.time = {};

blip.time.now = function() {
  return now();
};

blip.time.in = function(t) {
  return now() + t;
};

blip.time.seconds = function(t) {
  return t;
};
blip.time.ms = function(t) {
  return t * 0.001;
};
blip.time.samp = function(t) {
  return t / ctx.sampleRate;
};