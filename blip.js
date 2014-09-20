(function() {

var blip = {};
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
        var p = (Math.random().toString(16)+"000000000").substr(2,8);
        return s ? "-" + p.substr(0,4) + "-" + p.substr(4,4) : p ;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function BlipNodeCollection(nodes) {
  this.nodes = nodes || [];
}

BlipNodeCollection.prototype = {

  each: function(f) {
    for (var i = 0; i < this.nodes.length; i++) {
      f.call(this, this.nodes[i], i, this.nodes);
    }
  },

  contains: function(node) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i] === node) return true;
    }
    return false;
  },

  add: function(node) {
    if (this.nodes.indexOf(node) === -1) this.nodes.push(node);
  },

  remove: function(node) {
    var index = this.nodes.indexOf(node);
    if (index !== -1) this.nodes.splice(index, 1);
  },

  removeAll: function() {
    this.nodes = [];
  }

};


// the associated functions will be used by the `createNode` function within `blip.node`
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
};

function BlipNode() {
  return this;
};

BlipNode.prototype = {

  inputs: new BlipNodeCollection(),

  outputs: new BlipNodeCollection(),

  connect: function(blipnode) {
    if (this.node().numberOfOutputs > 0 && blipnode.node().numberOfInputs > 0) {
      this.node().connect(blipnode.node());
      this.outputs.add(blipnode);
      blipnode.inputs.add(this);
    }
    return this;
  },

  disconnect: function(blipnode) {
    // disconnect all
    this.node().disconnect();

    if (blipnode) {
      this.outputs.remove(blipnode);
      blipnode.inputs.remove(this);

      // reconnect to remaining outputs
      this.outputs.each(function(d) { this.connect(d); })
    } else {
      this.outputs.each(function(d) {
        d.inputs.remove(this);
      });
      this.outputs.removeAll();
    }

    return this;
  },

  prop: function(name, value) {
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
  },

  param: function(name, f) {
    if (arguments.length < 2) return this.node()[name];
    if (typeof f !== 'function') {
      this.node()[name].value = f;
    } else {
      f.call(this.node()[name]);
    }
    return this;
  },

  start: function(t) {
    this.node().start.call(this.node(), t);
  },

  stop: function(t) {
    this.node().stop.call(this.node(), t);
  },

  node: function() {
    return this.node();
  },

  toString: function() {
    return '[object BlipNode]';
  },

  valueOf: function() {
    return this.id();
  }

};

blip.node = function(type) {

  var other_args = Array.prototype.slice.call(arguments, 1);

  var reference = createNode(type);

  var id = guid();

  var node = new BlipNode();

  function createNode(t) {
    return nodeTypes[t].apply(ctx, other_args);
  }

  node.node = function() {
    return reference;
  };

  node.id = function() {
    return id;
  };

  return node;

}

var specialBlipNode = function(ref) {
  var node = new BlipNode();
  var id = guid();
  node.node = function() { return ref; };
  node.id = function() { return id; };
  return node;
}

// special nodes
blip.destination = specialBlipNode(ctx.destination);
blip.listener = specialBlipNode(ctx.listener);
blip.chain = function(nodes) {

  nodes = nodes || [];

  wire();

  function chain() {}

  function wire() {
    for (var i = 0; i < nodes.length-1; i++) {
      nodes[i].connect(nodes[i+1]);
    }
  }

  chain.node = function(blipnode) {
    nodes.push(blipnode);
    wire();
    return chain;
  };
  chain.start = function() {
    var a = nodes.slice(0,1);
    return a.length ? a[0] : null;
  };
  chain.end = function() {
    var a = nodes.slice(-1);
    console.log(a);
    return a.length ? a[0] : null;
  };
  chain.from = function(blipnode) {
    blipnode.connect(chain.start());
    return chain;
  };
  chain.to = function(blipnode) {
    chain.end().connect(blipnode);
    return chain;
  };
  chain.wire = function() {
    wire();
    return chain;
  }

  return chain;
}


/*
 Precise scheduling for audio events is
 based on the method described in this article by Chris Wilson:
   http://www.html5rocks.com/en/tutorials/audio/scheduling/
*/

blip.loop = function() {

  var lookahead = 25.0, // ms
      scheduleAheadTime = 0.1; // s

  var tempo; // ticks per minute

  var data = [];

  var currentTick = 0,
      nextTickTime = 0;

  var tick = function(t, d, i) {};

  var iterations = 0,
      limit = 0;

  var timer;

  function loop() {}

  function nextTick() {
    var secondsPerTick = 60 / tempo;
    nextTickTime += secondsPerTick;

    // cycle through ticks
    if (++currentTick >= data.length) {
      currentTick = 0;
      iterations += 1;
    }

  }

  function scheduleTick(tickNum, time) {
    tick.call(loop, time, data[tickNum], tickNum);
  }

  function scheduler() {
    while (nextTickTime < ctx.currentTime + scheduleAheadTime) {
      scheduleTick(currentTick, nextTickTime);
      nextTick();
      if (limit && iterations >= limit) {
        loop.reset();
        return;
      }
    }
    timer = window.setTimeout(scheduler, lookahead);
  }

  loop.tempo = function(bpm) {
    if (!arguments.length) return tempo;
    tempo = bpm;
    return loop;
  };
  loop.data = function(a) {
    if (!arguments.length) return data;
    data = a;
    return loop;
  };
  loop.lookahead = function(ms) {
    if (!arguments.length) return lookahead;
    lookahead = ms;
    return loop;
  };
  loop.scheduleAheadTime = function(s) {
    if (!arguments.length) return scheduleAheadTime;
    scheduleAheadTime = s;
    return loop;
  };
  loop.limit = function(n) {
    if (!arguments.length) return limit;
    limit = n;
    return loop;
  };
  loop.tick = function(f) {
    if (!arguments.length) return tick;
    tick = f;
    return loop;
  };
  loop.start = function(t) {
    nextTickTime = t || ctx.currentTime;
    scheduler();
    return loop;
  };
  loop.stop = function() {
    window.clearTimeout(timer);
    return loop;
  };
  loop.reset = function() {
    currentTick = 0;
    iterations = 0;
    return loop;
  };

  return loop;

};


var loadedSamples = {};

blip.sampleLoader = function() {

  var samples = {};

  var each = function() {},
      done = function() {};

  function loader() {
    var names = Object.keys(samples);
    var i = 0;
    next();
    function next() {
      if (i < names.length) {
        var name = names[i];
        i++;
        loadSample(name, samples[name]);
      } else {
        done();
      }
    }
    function loadSample(name, url) {
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.addEventListener('load', loaded, false);
      request.send();
      function loaded(event) {
        var req = event.target;
        var arrayBuffer = req.response;
        ctx.decodeAudioData(arrayBuffer, decoded);
      }
      function decoded(buffer) {
        loadedSamples[name] = buffer;
        each(name);
        next();
      }
    }
  }

  loader.samples = function(o) {
    if (!arguments.length) return samples;
    samples = o;
    return loader;
  };
  loader.each = function(f) {
    if (!arguments.length) return each;
    each = f;
    return loader;
  };
  loader.done = function(f) {
    if (!arguments.length) return done;
    done = f;
    return loader;
  };
  loader.load = function() {
    return loader();
  };

  return loader;
}

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
  clip.chain = function(c) {
    if (!arguments.length) return chain;
    chain = c;
    output_gain.disconnect(blip.destination);
    chain.from(output_gain).to(blip.destination);
    return clip;
  };
  clip.play = function(time, params) {
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
      }
      if (typeof params.rate !== 'undefined') {
        if (typeof params.rate === 'function') {
          BlipNode.prototype.param.call(specialBlipNode(source), 'playbackRate', params.rate)
        } else {
          source.playbackRate.setValueAtTime(params.rate, time)
        }
      }
    }

    source.connect(output_gain.node());
    source.start(time);
  };

  return clip;
}

blip.getContext = function() { return ctx; };
blip.getLoadedSamples = function() { return loadedSamples; };
blip.sample = function(name) {
  return loadedSamples[name];
}

window.blip = blip;

})()
