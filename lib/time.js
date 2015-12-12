import ctx from 'lib/context';

function getContextCurrentTime() { return ctx.currentTime; }

let time = {};

time.now = getContextCurrentTime;

time.in = function(offsetSeconds) {
  return getContextCurrentTime() + offsetSeconds;
}

// identity, kinda useless
time.seconds = function(t) { return t; }

time.ms = function(seconds) {
  return seconds / 1000;
}
time.samp = function(samples) {
  return samples / ctx.sampleRate;
}

export default time;
