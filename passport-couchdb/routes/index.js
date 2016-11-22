var User = require('../models/user');
var couch = require('../config/couch.js');
module.exports = function(app, passport) {

  app.get('/', function(req, res) {

    res.send({
      message: 'Login success'
    });
  });

  app.get('/sessionUser', function(req, res) {

    res.send({
      message: 'User:' + JSON.stringify(req.user)
    });
  });

  app.get('/sessionAll', function(req, res) {

    res.send({
      message: 'User:' + JSON.stringify(req.session)
    });
  });

  app.get('/addsessionUser', function(req, res) {

    req.user.someValue = '5631732578';
    req.session.addedValue = '123';
    res.send({
      message: 'User:se session' + JSON.stringify(req.session)
    });
  });
  app.get('/account', function(req, res) {
    res.render('account.ejs', {
      user: req.user
    });
  });

  app.get('/logout', function(req, res) {
    req.logout();
    res.send({
      message: 'logout success'
    });
  });

  app.get('/login', function(req, res) {

    res.send({
      message: 'Login failed'
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  app.get('/signup', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.send({
      message: 'success'
    });
  });

  app.get('/profile', isLoggedIn, function(req, res) {
    res.send({
      'profile': req.user
    });
  });

  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}