(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.blip = factory());
}(this, function () { 'use strict';

  var ctx = new AudioContext();

  /**
   * Generates a GUID string.
   * @returns {String} The generated GUID.
   * @example af8a8416-6e18-a307-bd9c-f2c947bbb3aa
   * @author Slavik Meltser (slavik@meltser.info).
   * @link http://slavik.meltser.info/?p=142
   */
  function guid() {
    function _p8(s) {
      var p = (Math.random().toString(16) + "000000000").substr(2, 8);
      return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
  }

  function BlipNodeCollection(nodes) {
    this.nodes = nodes || [];
  }

  BlipNodeCollection.prototype = {

    count: function count() {
      return this.nodes.length;
    },

    each: function each(f) {
      for (var i = 0; i < this.nodes.length; i++) {
        f.call(this, this.nodes[i], i, this.nodes);
      }
    },

    contains: function contains(node) {
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i] === node) return true;
      }
      return false;
    },

    add: function add(node) {
      if (this.nodes.indexOf(node) === -1) this.nodes.push(node);
    },

    remove: function remove(node) {
      var index = this.nodes.indexOf(node);
      if (index !== -1) this.nodes.splice(index, 1);
    },

    removeAll: function removeAll() {
      this.nodes = [];
    }

  };

  // the associated functions will be used by the `createNode` function within `blip.node`
  var NODE_TYPES = {
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
    'audioBufferSource': ctx.createBufferSource };

  // alias
  function BlipNode() {
    this.inputs = new BlipNodeCollection();
    this.outputs = new BlipNodeCollection();
    return this;
  };

  BlipNode.prototype.connect = function (blipnode) {
    if (this.node().numberOfOutputs > 0 && blipnode.node().numberOfInputs > 0) {
      this.node().connect(blipnode.node());
      this.outputs.add(blipnode);
      blipnode.inputs.add(this);
    }
    return this;
  };

  BlipNode.prototype.disconnect = function (blipnode) {
    // disconnect all
    this.node().disconnect();

    var me = this;

    if (blipnode) {
      this.outputs.remove(blipnode);
      blipnode.inputs.remove(this);

      // reconnect to remaining outputs
      this.outputs.each(function (n) {
        this.connect(n);
      });
    } else {
      this.outputs.each(function (n) {
        n.inputs.remove(me);
      });
      this.outputs.removeAll();
    }

    return this;
  };

  BlipNode.prototype.prop = function (name, value) {
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

  BlipNode.prototype.param = function (name, f) {
    if (arguments.length < 2) return this.node()[name];
    if (typeof f !== 'function') {
      this.node()[name].value = f;
    } else {
      f.call(this.node()[name]);
    }
    return this;
  };

  BlipNode.prototype.start = function (t) {
    this.node().start.call(this.node(), t);
  };

  BlipNode.prototype.stop = function (t) {
    this.node().stop.call(this.node(), t);
  };

  BlipNode.prototype.node = function () {
    return this.node();
  };

  BlipNode.prototype.toString = function () {
    return '[object BlipNode]';
  };

  BlipNode.prototype.valueOf = function () {
    return this.id();
  };

  BlipNode.prototype.call = function (methodName) {
    var args = Array.prototype.slice.call(arguments, 1);
    var node = this.node();
    if (typeof node[methodName] !== 'function') return;
    node[methodName].apply(node, args);
  };

  // wrap an existing AudioNode as a BlipNode
  BlipNode.fromAudioNode = function (ref) {
    var node = new BlipNode();
    var id = guid();
    node.node = function () {
      return ref;
    };
    node.id = function () {
      return id;
    };
    return node;
  };

  BlipNode.create = function (type) {
    var restParams = Array.prototype.slice.call(arguments, 1);
    var ref = createNode(type);
    var id = guid();

    var node = new BlipNode();

    function createNode(t) {
      return NODE_TYPES[t].apply(ctx, restParams);
    }

    node.node = function () {
      return ref;
    };
    node.id = function () {
      return id;
    };
    return node;
  };

  var destination = BlipNode.fromAudioNode(ctx.destination);

  var _samples = {};

  var sampleLibrary = {};
  sampleLibrary.get = function (name) {
    return _samples[name];
  };
  sampleLibrary.set = function (name, sample) {
    _samples[name] = sample;
  };
  sampleLibrary.list = function () {
    return Object.keys(_samples);
  };

  var clipFactory = function clipFactory() {
    var sample = undefined,
        rate = 1,
        gain = 1;

    var chain = null;

    var outputGain = BlipNode.create('gain').connect(destination);

    var clip = {};

    clip.sample = function (name) {
      if (!arguments.length) return sample;
      sample = sampleLibrary.get(name);
      return clip;
    };
    clip.rate = function (number) {
      if (!arguments.length) return rate;
      rate = number;
      return clip;
    };
    clip.gain = function (number) {
      if (!arguments.length) return gain;
      gain = number;
      outputGain.param('gain', gain);
      return clip;
    };
    clip.chain = function (c) {
      if (!arguments.length) return chain;
      chain = c;
      outputGain.disconnect(destination);
      chain.from(outputGain).to(destination);
      return clip;
    };
    clip.play = function (time, sourceAccessor) {
      time = time || 0;
      var source = ctx.createBufferSource();
      source.buffer = sample;
      source.playbackRate.value = clip.rate();
      if (typeof sourceAccessor === 'function') {
        sourceAccessor.call(clip, source);
      }
      source.connect(outputGain.node());
      source.start(time);
    };
    return clip;
  };

  var chainFactory = function chainFactory(nodes) {
    nodes = nodes || [];

    wire();

    function wire() {
      for (var i = 0; i < nodes.length - 1; i++) {
        nodes[i].connect(nodes[i + 1]);
      }
    }

    var chain = {};

    chain.node = function (blipnode) {
      nodes.push(blipnode);
      wire();
      return chain;
    };
    chain.start = function () {
      var a = nodes.slice(0, 1);
      return a.length ? a[0] : null;
    };
    chain.end = function () {
      var a = nodes.slice(-1);
      return a.length ? a[0] : null;
    };
    chain.from = function (blipnode) {
      blipnode.connect(chain.start());
      return chain;
    };
    chain.to = function (blipnode) {
      chain.end().connect(blipnode);
      return chain;
    };
    chain.wire = function () {
      wire();
      return chain;
    };

    return chain;
  };

  var loopFactory = function loopFactory() {
    var lookahead = 25.0,
        // ms
    scheduleAheadTime = 0.1; // s

    var tempo = undefined; // ticks per minute

    var tickInterval = undefined; // seconds per tick

    var data = [];

    var currentTick = 0,
        nextTickTime = 0;

    var tick = function tick(t, d, i) {};
    var each = function each(t, i) {};

    var iterations = 0,
        limit = 0;

    var timer = undefined;

    var loop = {};

    function nextTick() {
      nextTickTime += tickInterval;

      // cycle through ticks
      if (++currentTick >= data.length) {
        currentTick = 0;
        iterations += 1;
      }
    }

    function scheduleTick(tickNum, time) {
      tick.call(loop, time, data[tickNum], tickNum);
    }

    function scheduleIteration(iterationNum, time) {
      each.call(loop, time, iterationNum);
    }

    function scheduler() {
      while (nextTickTime < ctx.currentTime + scheduleAheadTime) {
        scheduleTick(currentTick, nextTickTime);
        if (currentTick === 0) {
          scheduleIteration(iterations, nextTickTime);
        }
        nextTick();
        if (limit && iterations >= limit) {
          loop.reset();
          return;
        }
      }
      timer = window.setTimeout(scheduler, lookahead);
    }

    loop.tempo = function (bpm) {
      if (!arguments.length) return tempo;
      tempo = bpm;
      tickInterval = 60 / tempo;
      return loop;
    };
    loop.tickInterval = function (s) {
      if (!arguments.length) return tickInterval;
      tickInterval = s;
      tempo = 60 / tickInterval;
      return loop;
    };
    loop.data = function (a) {
      if (!arguments.length) return data;
      data = a;
      return loop;
    };
    loop.lookahead = function (ms) {
      if (!arguments.length) return lookahead;
      lookahead = ms;
      return loop;
    };
    loop.scheduleAheadTime = function (s) {
      if (!arguments.length) return scheduleAheadTime;
      scheduleAheadTime = s;
      return loop;
    };
    loop.limit = function (n) {
      if (!arguments.length) return limit;
      limit = n;
      return loop;
    };
    loop.tick = function (f) {
      if (!arguments.length) return tick;
      tick = f;
      return loop;
    };
    loop.each = function (f) {
      if (!arguments.length) return each;
      each = f;
      return loop;
    };
    loop.start = function (t) {
      nextTickTime = t || ctx.currentTime;
      scheduler();
      return loop;
    };
    loop.stop = function () {
      window.clearTimeout(timer);
      return loop;
    };
    loop.reset = function () {
      currentTick = 0;
      iterations = 0;
      return loop;
    };

    return loop;
  };

  // `samples` is a mapping of names to URLs
  //   eg. { kick: 'path/to/kick.wav' }
  var loadSamples = function loadSamples(samples) {
    var sampleNames = Object.keys(samples);
    // map sample names to promises for decoded audio buffers
    var bufferPromises = sampleNames.map(function (name) {
      var sampleUrl = samples[name];
      return new Promise(function (resolve, reject) {
        fetch(sampleUrl, {
          method: 'GET'
        }).then(function (response) {
          return response.arrayBuffer();
        }, reject).then(function (arrayBuffer) {
          ctx.decodeAudioData(arrayBuffer, function (audioBuffer) {
            resolve(audioBuffer);
          }, reject);
        }, reject);
      });
    });
    return Promise.all(bufferPromises).then(function (buffers) {
      sampleNames.map(function (name, index) {
        sampleLibrary.set(name, buffers[index]);
      });
    });
  };

  function getContextCurrentTime() {
    return ctx.currentTime;
  }

  var time = {};

  time.now = getContextCurrentTime;

  time.in = function (offsetSeconds) {
    return getContextCurrentTime() + offsetSeconds;
  };

  // identity, kinda useless
  time.seconds = function (t) {
    return t;
  };

  time.ms = function (seconds) {
    return seconds / 1000;
  };
  time.samp = function (samples) {
    return samples / ctx.sampleRate;
  };

  var random = function random(a, b) {
    switch (arguments.length) {
      case 0:
        return Math.random();
      case 1:
        return Math.random() * a;
      case 2:
        return Math.random() * (b - a) + a;
    }
  };

  var chance = function chance(p) {
    var attempt = Math.random();
    return attempt < p;
  };

  // public api
  var blip = {};

  blip.version = '0.4.0';

  blip.time = time;
  blip.random = random;
  blip.chance = chance;

  blip.node = BlipNode.create;

  blip.clip = clipFactory;
  blip.chain = chainFactory;
  blip.loop = loopFactory;

  blip.destination = destination;
  blip.listener = BlipNode.fromAudioNode(ctx.listener);

  blip.getContext = function () {
    return ctx;
  };

  blip.loadSamples = loadSamples;

  blip.sampleLibrary = sampleLibrary;

  return blip;

}));