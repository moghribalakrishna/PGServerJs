var q = require('q');

// exports.getUserDBUrl = function(config, name, cb) {

//    var nano = require('nano')("http://" + config.couch_admin + ":" + config.couch_password + "@" + config.couch_host + ':' + config.couch_port);
//    var users = nano.use('_users');

//    users.get("org.couchdb.user:" + name, function(err, body) {
//       if (err) {
//          console.log(err);
//          cb("failed", null);
//       } else {
//          cb(null, body.dburl);
//       }
//    });
// };

//var env = process.env.NODE_ENV || 'development';
//var gconfig = require('./' + env + '.js');
module.exports = function(config) {
   var nano = require('nano')("http://" + config.username + ":" + config.password + "@" + config.host + ':' + config.port);
   //var nano = require('nano')("http://localhost:5984");
   var nanoPromises = require('nano-promises')(nano);
   var users = nanoPromises.use('_users');


   var profitGuruCouch = {};


   //var users = nano.use('_users');
   profitGuruCouch.findUser = function(userName) {
      if (userName.indexOf('org.couchdb.user') >= 0) {
         return users.get(userName);
      } else {
         return users.get("org.couchdb.user:" + userName);
      }
   };

   profitGuruCouch.login = function(username, password) {
      return nanoPromises.auth(username, password);
   };
   profitGuruCouch.getUserDBUrl = function(userName) {


      return users.get("org.couchdb.user:" + name);
   };

   profitGuruCouch.updateDbSecurity = function(creds) {

      var userDB = nanoPromises.use(creds.username);
      var secObj = {
         admins: {
            names: [],
            roles: []
         },
         members: {
            names: [creds.username],
            roles: []
         }
      };

      return userDB.insert(secObj, "_security");
   };

   profitGuruCouch.createUser = function(creds) {
      var user = {
         _id: "org.couchdb.user:" + creds.username,
         name: creds.username,
         roles: [],
         type: "user",
         password: creds.password,
         // dburl: "http://" + config.couch_host + ':' + config.couch_port + "/" + creds.username,
         email: creds.email
      };

      return users.insert(user);
   };

   profitGuruCouch.createUserDb = function(creds) {
      return nanoPromises.db.create(creds.username);
   };

   profitGuruCouch.createUserAndItsOwnDB = function(creds) {

      return createUser(creds)
         .then(createUserDb(creds))
         .then(updateDbSecurity(creds));


   };


   return profitGuruCouch;
};