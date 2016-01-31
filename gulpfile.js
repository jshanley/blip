var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var Builder = require('systemjs-builder');
var through = require('through2');

var plugins = gulpLoadPlugins();

function buildToStream() {
  return new Promise(function(resolve, reject) {
    var builder = new Builder();
    builder.loadConfig('./systemjs-config.js').then(function() {
      builder.buildStatic('lib/blip', {
        minify: false,
        runtime: false,
        globalName: 'blip'
      }).then(function(output) {
        var file = new plugins.util.File({
          path: 'output.js',
          contents: new Buffer(output.source)
        })
        var stream = through.obj(function(file, enc, cb) {
          this.push(file)
          return cb()
        })
        stream.write(file)
        stream.end()
        resolve(stream);
      }, reject)
    }, reject)
  })

}

gulp.task('build', function() {
  return buildToStream().then(function(stream) {
    return stream
      .pipe(plugins.rename('blip.js'))
      .pipe(plugins.size({ showFiles: true }))
      .pipe(gulp.dest('dist'))
      .pipe(plugins.uglify())
      .pipe(plugins.rename('blip.min.js'))
      .pipe(plugins.size({ showFiles: true }))
      .pipe(gulp.dest('dist'))
  })
})
