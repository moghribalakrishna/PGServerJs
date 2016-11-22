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

router.put('/update', function(req, res, next) {

	suppliersController.updateSupplier(req.body.supplier).then(function(resp) {
		res.send(resp);
		res.end();
	}).catch(function(reason) {
		res.send(new Error(reason));

	});

});

router.delete('/delete', function(req, res, next) {

	suppliersController.deleteSupplier(req.body.supplier).then(function(resp) {
		res.sendStatus(200);
		res.end();
	}).catch(function(reason) {
		res.send(new Error(reason));

	});

});

module.exports = router;