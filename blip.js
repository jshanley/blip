(function() {

var blip = {};

blip.version = '0.3.0';

/* AudioContext-MonkeyPatch
   https://github.com/cwilso/AudioContext-MonkeyPatch

   Copyright 2013 Chris Wilson

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
(function (global, exports, perf) {
  'use strict';

  function fixSetTarget(param) {
    if (!param)	// if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }

  if (window.hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
    window.AudioContext = webkitAudioContext;

    if (!AudioContext.prototype.hasOwnProperty('createGain'))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;
    if (!AudioContext.prototype.hasOwnProperty('createPeriodicWave'))
      AudioContext.prototype.createPeriodicWave = AudioContext.prototype.createWaveTable;


    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() {
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function(maxDelayTime) {
      var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() {
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when, offset, duration ) {
          if ( offset || duration )
            this.noteGrainOn( when, offset, duration );
          else
            this.noteOn( when );
        }
      }
      if (!node.stop)
        node.stop = node.noteOff;
      fixSetTarget(node.playbackRate);
      return node;
    };

    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() {
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() {
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if (AudioContext.prototype.hasOwnProperty( 'createOscillator' )) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.start)
          node.start = node.noteOn;
        if (!node.stop)
          node.stop = node.noteOff;
        if (!node.setPeriodicWave)
          node.setPeriodicWave = node.setWaveTable;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }
}(window));

/* END AudioContext-MonkeyPatch */
var ctx = new AudioContext();


function now() {
  return ctx.currentTime;
}

blip.time = {};

blip.time.now = function() {
  return now();
};

blip.time.in = function(t) {
  return now() + t;
};

blip.time.seconds = function(t) {
  return t;
};
blip.time.ms = function(t) {
  return t * 0.001;
};
blip.time.samp = function(t) {
  return t / ctx.sampleRate;
};

blip.chance = function(p) {
  var attempt = Math.random();
  return attempt < p;
};

blip.random = function(a,b) {
  switch(arguments.length) {
    case 0:
      return Math.random();
    case 1:
      return Math.random() * a;
    case 2:
      return Math.random() * (b - a) + a;
  }
};

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

// MIDI to Frequency
blip.mtof = function(midi) {
  return Math.pow(2, (midi - 69) / 12) * 440;
};

function BlipNodeCollection(nodes) {
  this.nodes = nodes || [];
}

BlipNodeCollection.prototype = {

  count: function() {
    return this.nodes.length;
  },

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
  this.inputs = new BlipNodeCollection();
  this.outputs = new BlipNodeCollection();
  return this;
};

BlipNode.prototype = {

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

  var chain = {};

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

  var tickInterval; // seconds per tick

  var data = [];

  var currentTick = 0,
      nextTickTime = 0;

  var tick = function(t, d, i) {};
  var each = function(t, i) {};

  var iterations = 0,
      limit = 0;

  var timer;

  function loop() {}

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

  loop.tempo = function(bpm) {
    if (!arguments.length) return tempo;
    tempo = bpm;
    tickInterval = 60 / tempo;
    return loop;
  };
  loop.tickInterval = function(s) {
    if (!arguments.length) return tickInterval;
    tickInterval = s;
    tempo = 60 / tickInterval;
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
  loop.each = function(f) {
    if (!arguments.length) return each;
    each = f;
    return loop;
  }
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


blip.envelope = function() {

  var attack = 0,
      decay = 0,
      sustain = 0.8,
      release = 0;

  var gain = ctx.createGain();

  // wrap the GainNode, giving it BlipNode methods
  var envelope = specialBlipNode(gain);

  // initialize the gain at 0
  envelope.param('gain', 0);

  // ADSR setter/getters
  envelope.attack = function(a) {
    if (!arguments.length) return attack;
    attack = a;
    return envelope;
  };
  envelope.decay = function(d) {
    if (!arguments.length) return decay;
    decay = d;
    return envelope;
  };
  envelope.sustain = function(s) {
    if (!arguments.length) return sustain;
    sustain = s;
    return envelope;
  };
  envelope.release = function(r) {
    if (!arguments.length) return release;
    release = r;
    return envelope;
  };
  envelope.noteOn = function(t) {
    t = typeof t === 'number' ? t : now();
    envelope.param('gain', function() {
      this.cancelScheduledValues(t);
      this.setValueAtTime(0, t);
      this.linearRampToValueAtTime(1, t + attack);
      this.setTargetAtTime(sustain, t + attack, decay * 0.368);
      this.setValueAtTime(sustain, t + attack + decay);
    });
    return envelope;
  };
  envelope.noteOff = function(t) {
    t = typeof t === 'number' ? t : now();
    envelope.param('gain', function() {
      this.cancelScheduledValues(t);
      //this.setValueAtTime(sustain, t);
      this.setTargetAtTime(0, t, release * 0.368)
      this.setValueAtTime(0, t + release);
    });
    return envelope;
  };
  envelope.play = function(t, dur) {
    envelope.noteOn(t);
    envelope.noteOff(t + dur);
    return envelope;
  };

  return envelope;
}

blip.getContext = function() { return ctx; };
blip.getLoadedSamples = function() { return loadedSamples; };
blip.sample = function(name) {
  return loadedSamples[name];
}

// TESTING
var testing = '123';

window.blip = blip;

})()
