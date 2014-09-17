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
    }

  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-smash');

  grunt.registerTask('build', ['smash']);
  grunt.registerTask('preview', ['smash', 'connect', 'watch']);
  grunt.registerTask('default', ['smash', 'connect', 'watch']);
}
