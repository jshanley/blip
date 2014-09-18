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
    }
    timer = window.setTimeout(scheduler, lookahead);
    if (limit && iterations >= limit) {
      loop.stop().reset();
    }
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
  }
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

blip.getContext = function() { return ctx; };
blip.getLoadedSamples = function() { return loadedSamples; };

window.blip = blip;

})()
