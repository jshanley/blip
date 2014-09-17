(function() {

var blip = {};
var ctx = new AudioContext();


/*
* Precise scheduling for audio events
* Based on the method described in this article by Chris Wilson:
*   http://www.html5rocks.com/en/tutorials/audio/scheduling/
*/
blip.scheduler = function() {

  var lookahead = 25.0, // ms
      scheduleAheadTime = 0.1, // s
      tickQueue = [];

  var tempo, // ticks per minute
      ticks; // number of ticks per cycle

  var currentTick = 0,
      nextTickTime = 0;

  var action = function(tickNum, time) {};

  var timer = 0;

  function my() {}

  function nextTick() {
    var secondsPerTick = 60 / tempo;
    nextTickTime += secondsPerTick;

    // cycle through ticks
    if (currentTick < ticks) {
      currentTick += 1;
    } else {
      currentTick = 0;
    }
  }

  function scheduleTick(tickNum, time) {
    //tickQueue.push({ tick: tickNum, time: when });
    action.call(my, tickNum, time);
  }

  function scheduler() {
    while (nextTickTime < ctx.currentTime + scheduleAheadTime) {
      scheduleTick(currentTick, nextTickTime);
      nextTick();
    }
    timer = window.setTimeout(scheduler, lookahead);
  }

  my.tempo = function(bpm) {
    if (!arguments.length) return tempo;
    tempo = bpm;
    return my;
  };
  my.ticks = function(n) {
    if (!arguments.length) return ticks;
    ticks = n;
    return my;
  };
  my.lookahead = function(ms) {
    if (!arguments.length) return lookahead;
    lookahead = ms;
    return my;
  };
  my.scheduleAheadTime = function(s) {
    if (!arguments.length) return scheduleAheadTime;
    scheduleAheadTime = s;
    return my;
  };
  my.action = function(f) {
    if (!arguments.length) return action;
    action = f;
    return my;
  };
  my.start = function() {
    nextTickTime = ctx.currentTime;
    timer = window.setTimeout(scheduler, lookahead);
  };
  my.stop = function() {
    window.clearTimeout(timer);
  };
  my.reset = function() {
    currentTick = 0;
  }

  return my;

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

  var output = ctx.createGain();
  output.connect(ctx.destination);

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
    source.connect(output);
    output.gain.value = gain;
    source.start(time);
  };

  return clip;
}

blip.__context = ctx;
blip.__clips = loadedSamples;

window.blip = blip;

})()
