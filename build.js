var jspm = require('jspm');

jspm.bundleSFX('util/browser-bundle', 'dist/blip.js', {
  minify: false
}).then(function() {
  console.log('dist/blip.js created')
})

jspm.bundleSFX('util/browser-bundle', 'dist/blip.min.js', {
  minify: true
}).then(function() {
  console.log('dist/blip.min.js created')
})
