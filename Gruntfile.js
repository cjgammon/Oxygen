module.exports = function(grunt) {

    var pkg = grunt.file.readJSON("package.json");

    // Project configuration.
    grunt.initConfig({
        uglify: {
            build: {
                src: 'src/O.js',
                dest: 'bin/O.min.js'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask("default", ["uglify"]);
};
