(function() {

var blip = {};
var ctx = new AudioContext();
blip.node = function() {

  var reference,
      id;

  var inputs = [],
      outputs = [];

  function node() {}

  function rewireInputs(a) {
    inputs.forEach(function(d) { d.node().disconnect(); })
    a.forEach(function(d) { d.node().connect(reference); })
    inputs = a;
  }
  function rewireOutputs(a) {
    reference.disconnect();
    a.forEach(function(d) { reference.connect(d.node())})
    outputs = a;
  }

  node.wrap = function(audionode) {
    reference = audionode;
    return node;
  };
  node.create = function(f) {
    reference = f.call(node, ctx);
    return node;
  }
  node.connect = function(blipnode) {
    outputs.push(blipnode);
    reference.connect(blipnode.node())
    return node;
  };
  node.inputs = function(a) {
    if (!arguments.length) return inputs;
    rewireInputs(a);
    return node;
  };
  node.outputs = function(a) {
    if (!arguments.length) return outputs;
    outputs = a;
    rewire();
    return node;
  };
  node.param = function(name, value) {
    if (!arguments.length) return node;
    if (arguments.length === 2) {
      reference[name].value = value;
    } else {
      return reference[name].value;
    }
    return node;
  };
  node.node = function() {
    return reference;
  }

  return node;

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

  var outputGain = ctx.createGain();
  outputGain.connect(ctx.destination);

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
    var source = ctx.createBufferSource();
    source.buffer = sample;
    source.playbackRate.value = rate;
    source.connect(outputGain);
    outputGain.gain.value = gain;
    source.start(time);
  };

  return clip;
}

blip.__context = ctx;
blip.__clips = loadedSamples;

window.blip = blip;

})()
