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
