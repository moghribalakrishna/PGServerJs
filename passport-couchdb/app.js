var express = require('express'),
  path = require('path'),
  favicon = require('static-favicon'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  engine = require('ejs-locals');

var routes = require('./routes/index');
var couch = require('./config/couch.js');
// passport stuff
var passport = require('passport'),
  flash = require('connect-flash'),
  LocalStrategy = require('passport-local').Strategy;

var env = process.env.NODE_ENV || 'development',
  config = require('./config/' + env + '.js'),
  resourceful = require('resourceful');

var sessionstore = require('sessionstore');
var User = require('./models/user');

var app = express();
var config =
  require('./config/passportConfig')(passport, config);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', engine);

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport stuff
app.use(session({
  secret: 'some bad text',
  resave: false,
  saveUninitialized: false,
  store: sessionstore.createSessionStore({
    type: 'couchdb',
    host: 'http://localhost', // optional
    port: 5984, // optional
    dbName: 'express-sessions', // optional
    collectionName: 'sessions', // optional
    timeout: 10000, // optional
    username: 'couchadmin',
    password: 'test'
  })
})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./routes/index.js')(app, passport);


/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

// resourceful.use('couchdb', {
//   database: config.database
// });


module.exports = app;