// load all the things we need
var LocalStrategy = require('passport-local').Strategy;

// load up the user model


// expose this function to our app using module.exports
module.exports = function(passport, config) {
    var couch = require('./couch.js')(config);
    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        couch.findUser(id).then(function(user) {
            done(null, user[0]);
        }).catch(function(reason) {
            done(reason, null);
        });
    });

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with username
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) {
            // asynchronous
            // User.findOne wont fire unless data is sent back
            process.nextTick(function() {
                // find a user whose username is the same as the forms username
                // we are checking to see if the user trying to login already exists
                couch.findUser(
                    username).then(
                    function(user) {

                        // check to see if theres already a user with that username
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    }).catch(function(reason) {
                    couch.createUser({
                        username: username,
                        password: password
                    }).then(function(createdUser) {
                        return done(null, createdUser[0]);
                    }).catch(function(reason) {
                        return done(err);
                    });

                });

            });

        }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    // passport.use('local-login', new LocalStrategy({
    //         // by default, local strategy uses username and password, we will override with username
    //         usernameField: 'username',
    //         passwordField: 'password',
    //         passReqToCallback: true // allows us to pass back the entire request to the callback
    //     },
    //     function(req, username, password, done) { // callback with username and password from our form

    //         // find a user whose username is the same as the forms username
    //         // we are checking to see if the user trying to login already exists
    //         User.findOne({
    //             'local.username': username
    //         }, function(err, user) {
    //             // if there are any errors, return the error before anything else
    //             if (err)
    //                 return done(err);

    //             // if no user is found, return the message
    //             if (!user)
    //                 return done(null, false, req.flash('loginMessage', 'No user found.')); // req.flash is the way to set flashdata using connect-flash

    //             // if the user is found but the password is wrong
    //             if (!user.validPassword(password))
    //                 return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

    //             // all is well, return successful user
    //             return done(null, user);
    //         });

    //     }));

    passport.use('local-login', new LocalStrategy(
        function(username, password, done) {
            process.nextTick(function() {
                couch.login(username, password).then(function(user) {
                    if (user[0].name) {
                        couch.findUser(user[0].name).then(function(loggedInUser) {
                            return done(null, loggedInUser[0]);
                        }).catch(function(reason) {
                            return done(reason);
                        });
                    } else {

                        return done(null, user[0]);
                    }
                }).catch(function(reason) {
                    return done(reason);
                });


            });
        }
    ));
};