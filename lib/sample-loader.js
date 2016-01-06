import ctx from 'lib/context';
import sampleLibrary from 'lib/sample-library';

let sampleLoader = function() {
  let samples = {};

  let each = function() {},
      done = function() {};

  function loader() {
    let names = Object.keys(samples);
    let i = 0;
    next();
    function next() {
      if (i < names.length) {
        let name = names[i];
        i++;
        loadSample(name, samples[name]);
      } else {
        done();
      }
    }
    function loadSample(name, url) {
      let request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.responseType = 'arraybuffer';
      request.addEventListener('load', loaded, false);
      request.send();
      function loaded(event) {
        let req = event.target;
        let arrayBuffer = req.response;
        ctx.decodeAudioData(arrayBuffer, decoded);
      }
      function decoded(buffer) {
        sampleLibrary.set(name, buffer);
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

export default sampleLoader;
