blip.getContext = function() { return ctx; };
blip.getLoadedSamples = function() { return loadedSamples; };
blip.sample = function(name) {
  return loadedSamples[name];
}

// TESTING
var testing = '123';

window.blip = blip;

})()
