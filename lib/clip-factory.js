import ctx from 'lib/context';
import destination from 'lib/destination';
import BlipNode from 'lib/blip-node';

let clipFactory = function() {
  let sample,
      rate = 1,
      gain = 1;

  let chain = null;

  let outputGain = BlipNode.create('gain').connect(destination);

  let clip = {};

  clip.sample = function(name) {
    if (!arguments.length) return sample;
    sample = loadedSamples[name];
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
  clip.chain = function(c) {
    if (!arguments.length) return chain;
    chain = c;
    outputGain.disconnect(destination);
    chain.from(outputGain).to(destination);
    return clip;
  };
  clip.play = function(time, params) {
    time = time || 0;
    let source = ctx.createBufferSource();
    source.buffer = sample;

    if (params) {
      if (typeof params.gain !== 'undefined') {
        if (typeof params.gain === 'function') {
          outputGain.param('gain', params.gain)
        } else {
          outputGain.param('gain', function() {
            this.setValueAtTime(params.gain, time)
          })
        }
      } else {
        outputGain.param('gain', params.gain);
      }
      if (typeof params.rate !== 'undefined') {
        if (typeof params.rate === 'function') {
          BlipNode.prototype.param.call(BlipNode.fromAudioNode(source), 'playbackRate', params.rate)
        } else {
          source.playbackRate.setValueAtTime(params.rate, time)
        }
      } else {
        BlipNode.prototype.param.call(BlipNode.fromAudioNode(source), 'playbackRate', rate);
      }
    } else {
      if (gain !== 1) outputGain.param('gain', gain);
      if (rate !== 1) BlipNode.prototype.param.call(BlipNode.fromAudioNode(source), 'playbackRate', rate);
    }

    source.connect(outputGain.node());
    source.start(time);
  };
};

export default clipFactory;
