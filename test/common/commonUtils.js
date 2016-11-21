var peopleModel = require('../../models').profitGuru_people;
var stockLocationsModel = require('../../models').profitGuru_stock_locations;
var employeesModel = require('../../models').profitGuru_employees;
var profitGuruFaker = require('./profitGuruFaker.js');
var ItemController = require('../../controllers/Items');
var ItemModel = require('../../models').profitGuru_items;

var q = require('q');

var commonTestUtils = function() {
	this.createFirstEmployeeIfNotExists =
		function() {
			var defered = q.defer();

			employeesModel.findById(1).then(function(person) {
				if (!person) {
					var person_data = profitGuruFaker.getPersonData();
					peopleModel.create(person_data).then(function(person) {
						var employeeFaker = profitGuruFaker.getFakerEmployee();
						employeeFaker.person_id = person.person_id;
						employeesModel.create(employeeFaker).then(function(resp) {
							defered.resolve(true);
						});
					});
				} else {
					defered.resolve(true);
				}
			});

			return defered.promise;
		};

	this.createFirstStockLocationIfNotExists = function() {
		var defered = q.defer();
		stockLocationsModel.findById(1).then(function(location) {
			if (!location) {
				var stockLocationFaker = profitGuruFaker.getFakerStockLoaction();
				stockLocationsModel.create(stockLocationFaker).then(function(resp) {
					defered.resolve(true);
				});
			} else {
				defered.resolve(true);
			}
		});
		return defered.promise;
	};

	this.createSomeItems = function() {
		var noOfItems2Create = 2;
		var promiseList = [];

		var anItem;
		for (var i = 0; i < noOfItems2Create; ++i) {
			//anItem = profitGuruFaker.getFakerItem();
			//anItem.supplier_id = null;

			promiseList.push(ItemController.createItem(profitGuruFaker.getFakerItem()));
		}

		return q.all(promiseList);
	};

	this.getAllItemsInSqlDb = function() {
		return ItemModel.all();
	};
};

module.exports = new commonTestUtils();