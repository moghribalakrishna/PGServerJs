var models = require('../models');
var SuppExpress = require('express');
var suppliersController = require('../controllers/Suppliers.js');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
require('errors');
var router = SuppExpress.Router();
var app = SuppExpress();
router.use(bodyParser.urlencoded({
    extended: true
}));
router.use(bodyParser.json());

//http://racksburg.com/choosing-an-http-status-code/


router.post('/create', function(req, res, next) {

    suppliersController.createSupplier(req.body.supplier).then(function(resp) {
        res.send(resp);
        res.end();
    }).catch(function(reason) {
        res.send(new Error(reason));

    });

});

// router.get('/:user_id/destroy', function(req, res) {
//   models.User.destroy({
//     where: {
//       id: req.params.user_id
//     }
//   }).then(function() {
//     res.redirect('/');
//   });
// });

// router.post('/:user_id/tasks/create', function (req, res) {
//   models.Task.create({
//     title: req.body.title,
//     UserId: req.params.user_id
//   }).then(function() {
//     res.redirect('/');
//   });
// });

// router.get('/:user_id/tasks/:task_id/destroy', function (req, res) {
//   models.Task.destroy({
//     where: {
//       id: req.params.task_id
//     }
//   }).then(function() {
//     res.redirect('/');
//   });
// });
// SuppExpress().use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.send({
//         message: err.message,
//         error: (app.get('env') === 'development') ? err : {}
//     });
// });

// router.use(methodOverride());
// router.use(logErrors);
// router.use(clientErrorHandler);
// router.use(errorHandler);

// //http://racksburg.com/choosing-an-http-status-code/
// function logErrors(err, req, res, next) {
//     console.error(err.stack);
//     next(err);
// }

// function clientErrorHandler(err, req, res, next) {
//     if (req.xhr) {
//         res.status(500).send({
//             error: err.message
//         }).end();

//     } else {
//         next(err);
//     }
// }

// function errorHandler(err, req, res, next) {

//     //var statusCode = error.status ? 404
//     res.status(500).send({
//         error: err.message
//     }).end();

// }

module.exports = router;