blip.getContext = function() { return ctx; };
blip.getLoadedSamples = function() { return loadedSamples; };
blip.sample = function(name) {
  return loadedSamples[name];
}

window.blip = blip;

})()
