import "context";

blip.clip = function() {

  var sample,
      rate = 1,
      gain = 1;

  var output = ctx.createGain();
  output.connect(ctx.destination);

  function clip() {}

  clip.sample = function(name) {
    if (!arguments.length) return sample;
    sample = loadedSamples[name];
    return clip;
  };
  clip.defaultRate = function(number) {
    if (!arguments.length) return defaultRate;
    defaultRate = number;
    return clip;
  };
  clip.rate = function(number) {
    if (!arguments.length) return rate;
    rate = number;
    return clip;
  };
  clip.gain = function(number) {
    if (!arguments.length) return gain;
    gain = number;
    return clip;
  };
  clip.play = function(time) {
    var source = ctx.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = rate;
    source.connect(output);
    output.gain.value = gain;
    source.start(time);
  };

  return clip;
}
