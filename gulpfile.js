// require plugins

var argv = require('yargs')
  .usage('Usage: $0 <command> [options]')
  .example('$0 node-combo', 'ProgitGuru Node Server')
  .alias('env', 'environment')
  .default('env', 'development')
  .describe('env', 'One of the available environments [development,production]')
  .alias('nodeApp', 'nodeAppType')
  .default('nodeApp', 'node-combo')
  .alias('d', 'debug')
  .describe('d', 'Debug target File')
  .alias('b', 'brk')
  .alias('t', 'test')
  .default('t', false)
  .describe('t', 'is It UT')
  .describe('b', 'break on firstline while dubugging')
  .default('b', false)
  .describe('nodeApp', 'One of the available nodeApp appTypes [node-combo,node-cloud,node-retail,node-restaurant]')
  .help('h')
  .alias('h', 'help')
  .argv;

var debugTarget = argv.d || 'bin/www';
debugTarget = process.env.PWD + '/' + debugTarget;

// var debugParams = argv.b === false ? '--debug' : '--debug-brk';

// debugParams = argv.t ? '_mocha ' + debugParams : debugParams;

console.log('debugTarget=', debugTarget);

var gulp = require('gulp'),
  nodeInspector = require('gulp-node-inspector'),
  nodemon = require('gulp-nodemon');

gulp.task('nodemon', function() {
  nodemon({
    script: debugTarget, // location of webserver module
    ext: '',
    tasks: ['jshint'], // any task you want to run before refreshing the server, TODO
    nodeArgs: ['--debug-brk'], //important must pass the debug flag to work,
    verbose: true
  });
});
//nodeArgs: ['--debug', '--debug-brk', '/home/balakrishna/.nvm/v4.4.0/bin/_mocha'], //important must pass the debug flag to work,
// nodeArgs: ['--debug-brk'], //important must pass the debug flag to work,
// nodeArgs: ['--debug'], //important must pass the debug flag to work,
gulp.task('node-inspector', ['nodemon'], function() {
  gulp.src([])
    .pipe(nodeInspector({
      debugPort: 5858,
      webHost: '0.0.0.0',
      webPort: 8080,
      saveLiveEdit: true,
      preload: false,
      inject: true,
      hidden: [/node_modules/i],
      stackTraceLimit: 50,
      sslKey: '',
      sslCert: ''
    }));
});

gulp.task('default', function() {
  gulp.start('node-inspector');
});

gulp.task('debug', function() {
  gulp.start('node-inspector');
});

// var mocha = require('gulp-spawn-mocha');
// var DEBUG = process.env.NODE_ENV === 'debug',
//   CI = process.env.CI === 'true';

// gulp.task('test-debug', function() {
//   return gulp.src(['test/*/*/UT_*.js'], {
//       read: false
//     })
//     .pipe(mocha({
//       debugBrk: false,
//       // r: 'test/unit/controllers/UT_items.js',
//       R: CI ? 'spec' : 'nyan',
//       istanbul: !DEBUG
//     }));
// });