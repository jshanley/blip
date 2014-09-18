import "context";
import "node";

blip.clip = function() {

  var sample,
      rate = 1,
      gain = 1;

  var gain = blip.node('gain').node()

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
    var source = blip.node('bufferSource').node()
    source.buffer = sample;
    source.playbackRate.value = rate;
    source.connect(outputGain);
    outputGain.gain.value = gain;
    source.start(time);
  };

  return clip;
}
