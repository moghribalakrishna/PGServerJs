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

var env = process.env.NODE_ENV || 'development';
var gconfig = require('./' + env + '.js');
var profitGuruCouch = function() {
   var _self = this;
   //var nano = require('nano')("http://" + gconfig.username + ":" + gconfig.password + "@" + gconfig.host + ':' + gconfig.port);
   var nano = require('nano')("http://localhost:5984");
   var nanoPromises = require('nano-promises')(nano);
   var users = nanoPromises.use('_users');
   //var users = nano.use('_users');
   this.findUser = function(userName) {
      return users.get(userName);
   };

   this.updateDbSecurity = function(creds) {

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

   this.createUser = function(creds) {
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

   this.createUserDb = function(creds) {
      return nanoPromises.db.create(creds.username);
   };

   this.createUserAndItsOwnDB = function(creds) {

      return _self.createUser(creds)
         .then(_self.createUserDb(creds))
         .then(_self.updateDbSecurity(creds));


   };

   this.createUserDBOrg = function(creds, cb) {


      var user = {
         _id: "org.couchdb.user:" + creds.username,
         name: creds.username,
         roles: [],
         type: "user",
         password: creds.password,
         // dburl: "http://" + config.couch_host + ':' + config.couch_port + "/" + creds.username,
         email: creds.email
      };

      var userDB = nano.use(creds.username);
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

      console.log(user);


      function createUser() {
         var deferred = q.defer();

         users.insert(user, creds._id, function(err, body) {
            if (err) {
               deferred.reject(new Error("Error message: " + err.message));
            } else {
               deferred.resolve(body);
            }
         });

         return deferred.promise;
      }

      function createDB() {
         var deferred = q.defer();

         nano.db.create(creds.username, function(err, body) {
            if (err) {
               deferred.reject(new Error("Error message: " + err.message));
            } else {
               deferred.resolve(body);
            }
         });
         return deferred.promise;
      }


      function updateSecurity() {
         var deferred = q.defer();

         userDB.insert(secObj, "_security", function(err, body) {
            if (err) {
               deferred.reject(new Error("Error message: " + err.message));
            } else {
               deferred.resolve(body);
            }
         });
         return deferred.promise;
      }


      createUser()
         .then(createDB())
         .then(updateSecurity())
         .then(function(response) {
            console.log(response);
            cb(null, user.dburl);
         }, function(error) {
            console.log(error);
            cb("failed", null);
         });


   };
};

module.exports = new profitGuruCouch();