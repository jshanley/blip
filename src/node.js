import "context";
import "util";

// the associated functions will be used by the `createNode` function below
var nodeTypes = {
  'gain': ctx.createGain,
  'delay': ctx.createDelay,
  'panner': ctx.createPanner,
  'convolver': ctx.createConvolver,
  'analyser': ctx.createAnalyser,
  'channelSplitter': ctx.createChannelSplitter,
  'channelMerger': ctx.createChannelMerger,
  'dynamicsCompressor': ctx.createDynamicsCompressor,
  'biquadFilter': ctx.createBiquadFilter,
  'waveShaper': ctx.createWaveShaper,
  'oscillator': ctx.createOscillator,
  'periodicWave': ctx.createPeriodicWave,
  'bufferSource': ctx.createBufferSource,
  'audioBufferSource': ctx.createBufferSource, // alias

  // USER SHOULD NOT USE THESE DIRECTLY
  // use `blip.listener` and `blip.destination` instead
  'listener': function() { return ctx.listener; },
  'destination': function() { return ctx.destination; }
};

blip.node = function(type) {

  var other_args = Array.prototype.slice.call(arguments, 1);

  var reference = createNode(type);

  var id = guid();

  function node() {}

  function createNode(t) {
    return nodeTypes[t].apply(ctx, other_args);
  }

  node.connect = function(blipnode) {
    reference.connect(blipnode.node())
    return node;
  };
  node.param = function(name, f) {
    if (arguments.length < 2) return reference[name];
    if (typeof f !== 'function') {
      reference[name].value = f;
    } else {
      f.call(reference[name]);
    }
    return node;
  };
  node.node = function() {
    return reference;
  };
  node.id = function() {
    return id;
  };

  return node;

}

// special nodes
blip.destination = blip.node('destination');
blip.listener = blip.node('listener');
