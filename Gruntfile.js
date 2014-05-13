module.exports = function(grunt) {
  var mozjpeg = require('imagemin-mozjpeg');

  grunt.initConfig({
    imagemin: {                          // Task
//      static: {                          // Target
//        options: {                       // Target options
//          optimizationLevel: 3,
//          use: [mozjpeg()]
//        },
//        files: {                         // Dictionary of files
//          'app/img/*.jpeg': 'app/img/*.jpeg' // 'destination': 'source'
////          'dist/img.jpg': 'src/img.jpg',
////          'dist/img.gif': 'src/img.gif'
//        }
//      }
      dynamic: {                         // Another target
        files: [{
          expand: true,                  // Enable dynamic expansion
          cwd: 'app/img/',                   // Src matches are relative to this path
          src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
          dest: 'app/img/'                  // Destination path prefix
        }]
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.registerTask('default', ['imagemin']);
}