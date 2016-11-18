var User = require('../models/user');
var couch = require('../config/couch.js');
module.exports = function(app, passport) {


  app.get('/', function(req, res) {
    // res.render('index.ejs', {
    //   user: req.user
    // });
    res.send({
      message: 'Login success'
    });
  });

  app.get('/sessionUser', function(req, res) {
    // res.render('index.ejs', {
    //   user: req.user
    // });
    res.send({
      message: 'User:' + JSON.stringify(req.user)
    });
  });


  app.get('/sessionAll', function(req, res) {
    // res.render('index.ejs', {
    //   user: req.user
    // });
    res.send({
      message: 'User:' + JSON.stringify(req.session)
    });
  });

  app.get('/addsessionUser', function(req, res) {
    // res.render('index.ejs', {
    //   user: req.user
    // });
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
    // res.render('login.ejs', {
    //   message: req.flash('loginMessage')
    // });
    res.send({
      message: 'Login failed'
    });
  });

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // app.get('/signup', function(req, res) {
  //   res.render('signup.ejs', {
  //     message: req.flash('signupMessage')
  //   });
  // });

  // app.post('/register', function(req, res) {
  //   console.log("/register");

  //   couch.createUserDB(config, req.body, function(err, db) {
  //     if (err) {
  //       console.log(err);
  //       res.json(err);
  //     } else {
  //       console.log(db);
  //       res.json(db);
  //     }

  //   });
  // });

  // process the signup form
  // app.post('/signup', function(req, res) {

  //   couch.createUserAndItsOwnDB(req.body.user).then(function(resp) {
  //     res.redirect('/');
  //   }).catch(function(reason) {
  //     console.log('Error : ', reason);
  //     res.send(500, reason);
  //   });
  // });
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