import ctx from 'lib/context';
import destination from 'lib/destination';
import BlipNode from 'lib/blip-node';
import sampleLibrary from 'lib/sample-library';

let clipFactory = function() {
  let sample,
      rate = 1,
      gain = 1;

  let chain = null;

  let outputGain = BlipNode.create('gain').connect(destination);

  let clip = {};

  clip.sample = function(name) {
    if (!arguments.length) return sample;
    sample = sampleLibrary.get(name);
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
    outputGain.param('gain', gain); 
    return clip;
  };
  clip.chain = function(c) {
    if (!arguments.length) return chain;
    chain = c;
    outputGain.disconnect(destination);
    chain.from(outputGain).to(destination);
    return clip;
  };
  clip.play = function(time, sourceAccessor) {
    time = time || 0;
    let source = ctx.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = clip.rate()
    if (typeof sourceAccessor === 'function') {
      sourceAccessor.call(clip, source)
    }
    source.connect(outputGain.node());
    source.start(time);
  };
  return clip;
};

export default clipFactory;
