module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    connect: {
      server: {
        options: {
          port: 8080
        }
      }
    },

    watch: {
      options: {
        livereload: true
      },
      src: {
        options: {
          livereload: false
        },
        files: 'src/*.js',
        tasks: ['smash']
      },
      output: {
        files: ['blip.js', 'index.html']
      }
    },

    smash: {
      together: {
        src: 'src/index.js',
        dest: './blip.js'
      }
    },

    uglify: {
      dist: {
        files: {
          './blip.min.js': ['./blip.js']
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-smash');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('build', ['smash', 'uglify']);
  grunt.registerTask('preview', ['smash', 'uglify', 'connect', 'watch']);
  grunt.registerTask('default', ['build']);
}
