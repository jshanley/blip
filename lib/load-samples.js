import ctx from 'lib/context';
import sampleLibrary from 'lib/sample-library';

// `samples` is a mapping of names to URLs
//   eg. { kick: 'path/to/kick.wav' }
const loadSamples = function(samples) {
  const sampleNames = Object.keys(samples);
  // map sample names to promises for decoded audio buffers
  const bufferPromises = sampleNames.map((name) => {
    const sampleUrl = samples[name];
    return new Promise((resolve, reject) => {
      fetch(sampleUrl, {
        method: 'GET'
      }).then((response) => {
        return response.arrayBuffer();
      }, reject).then((arrayBuffer) => {
        ctx.decodeAudioData(arrayBuffer, (audioBuffer) => {
          resolve(audioBuffer);
        }, reject);
      }, reject);
    })
  });
  return Promise.all(bufferPromises).then((buffers) => {
    sampleNames.map((name, index) => {
      sampleLibrary.set(name, buffers[index]);
    })
  })
}

export default loadSamples;
