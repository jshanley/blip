let _samples = {};

let sampleLibrary = {};
sampleLibrary.get = function(name) {
  return _samples[name];
};
sampleLibrary.set = function(name, sample) {
  _samples[name] = sample;
};
sampleLibrary.list = function() {
  return Object.keys(_samples);
}

export default sampleLibrary;
