import "context";
import "node";

blip.clip = function() {

  var sample,
      rate = 1,
      gain = 1;

  var chain = null;

  var output_gain = blip.node('gain').connect(blip.destination);

  function clip() {}

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
    output_gain.disconnect(blip.destination);
    chain.from(output_gain).to(blip.destination);
    return clip;
  };
  clip.play = function(time, params) {
    time = time || 0;
    var source = ctx.createBufferSource();
    source.buffer = sample;

    if (params) {
      if (typeof params.gain !== 'undefined') {
        if (typeof params.gain === 'function') {
          output_gain.param('gain', params.gain)
        } else {
          output_gain.param('gain', function() {
            this.setValueAtTime(params.gain, time)
          })
        }
      } else {
        output_gain.param('gain', params.gain);
      }
      if (typeof params.rate !== 'undefined') {
        if (typeof params.rate === 'function') {
          BlipNode.prototype.param.call(specialBlipNode(source), 'playbackRate', params.rate)
        } else {
          source.playbackRate.setValueAtTime(params.rate, time)
        }
      } else {
        BlipNode.prototype.param.call(specialBlipNode(source), 'playbackRate', rate);
      }
    } else {
      if (gain !== 1) output_gain.param('gain', gain);
      if (rate !== 1) BlipNode.prototype.param.call(specialBlipNode(source), 'playbackRate', rate);
    }

    source.connect(output_gain.node());
    source.start(time);
  };

  return clip;
}
