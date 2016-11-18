// require plugins
var gulp = require('gulp'),
  nodeInspector = require('gulp-node-inspector'),
  nodemon = require('gulp-nodemon');

gulp.task('nodemon', function() {
  nodemon({

    // location of webserver module
    script: './bin/www',
    ext: '',

    // enter any tasks you want to run before refreshing the server
    tasks: ['jshint'],

    //important must pass the debug flag to work
    nodeArgs: ['--debug']
  });
});

gulp.task('node-inspector', ['nodemon'], function() {
  gulp.src([])
    .pipe(nodeInspector({
      debugPort: 5858,
      webHost: '0.0.0.0',
      webPort: 8080,
      saveLiveEdit: true,
      preload: true,
      inject: true,
      hidden: [],
      stackTraceLimit: 50,
      sslKey: '',
      sslCert: ''
    }));
});

gulp.task('default', function() {
  gulp.start('node-inspector');
});