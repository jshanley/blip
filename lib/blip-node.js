import ctx from 'lib/context';
import guid from 'lib/guid';
import BlipNodeCollection from 'lib/blip-node-collection';

// the associated functions will be used by the `createNode` function within `blip.node`
const NODE_TYPES = {
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
};

function BlipNode() {
  this.inputs = new BlipNodeCollection();
  this.outputs = new BlipNodeCollection();
  return this;
};

BlipNode.prototype.connect = function(blipnode) {
  if (this.node().numberOfOutputs > 0 && blipnode.node().numberOfInputs > 0) {
    this.node().connect(blipnode.node());
    this.outputs.add(blipnode);
    blipnode.inputs.add(this);
  }
  return this;
};

BlipNode.prototype.disconnect = function(blipnode) {
  // disconnect all
  this.node().disconnect();

  var me = this;

  if (blipnode) {
    this.outputs.remove(blipnode);
    blipnode.inputs.remove(this);

    // reconnect to remaining outputs
    this.outputs.each(function(n) { this.connect(n); })
  } else {
    this.outputs.each(function(n) {
      n.inputs.remove(me);
    });
    this.outputs.removeAll();
  }

  return this;
}

BlipNode.prototype.prop = function(name, value) {
  if (arguments.length < 2) {
    if (typeof name === 'object') {
      for (var p in name) {
        this.node()[p] = name[p];
      }
      return this;
    } else {
      return this.node()[name];
    }
  }
  this.node()[name] = value;
  return this;
};

BlipNode.prototype.param = function(name, f) {
  if (arguments.length < 2) return this.node()[name];
  if (typeof f !== 'function') {
    this.node()[name].value = f;
  } else {
    f.call(this.node()[name]);
  }
  return this;
};

BlipNode.prototype.start = function(t) {
  this.node().start.call(this.node(), t);
};

BlipNode.prototype.stop = function(t) {
  this.node().stop.call(this.node(), t);
};

BlipNode.prototype.node = function() {
  return this.node();
};

BlipNode.prototype.toString = function() {
  return '[object BlipNode]';
};

BlipNode.prototype.valueOf = function() {
  return this.id();
};

BlipNode.prototype.call = function(methodName) {
  var args = Array.prototype.slice.call(arguments, 1);
  var node = this.node();
  if (typeof node[methodName] !== 'function') return;
  node[methodName].apply(node, args);
};

// wrap an existing AudioNode as a BlipNode
BlipNode.fromAudioNode = function(ref) {
  let node = new BlipNode();
  let id = guid();
  node.node = function() { return ref; };
  node.id = function() { return id; };
  return node;
}

BlipNode.create = function(type) {
  let restParams = Array.prototype.slice.call(arguments, 1);
  let ref = createNode(type);
  let id = guid();

  let node = new BlipNode();

  function createNode(t) {
    return NODE_TYPES[t].apply(ctx, restParams);
  }

  node.node = function() { return ref; };
  node.id = function() { return id; };
  return node;
}

export default BlipNode;
