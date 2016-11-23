#!/usr/bin/env node

var BPromise = require('bluebird');
var Models = require('./models');
var ItemModel = Models.profitGuru_items;
// var ItemTaxesModel = Models.profitGuru_items_taxes;
// var ItemDiscountsModel = Models.profitGuru_discounts;
// var ItemQuantitiesModel = Models.profitGuru_item_quantities;
// var peopleModel = Models.profitGuru_people;
// var supplierModel = Models.profitGuru_suppliers;
// var stockLocationsModel = Models.profitGuru_stock_locations;
// var employeesModel = Models.profitGuru_employees;
// var createdPersonId;

var profitGuruFaker = require('./test/common/profitGuruFaker.js');
var commonTestUtils = require('./test/common/commonUtils.js');
var itemList;
Models.sequelize.sync().then(function(resp) {
  return Promise.all([commonTestUtils.createFirstEmployeeIfNotExists(), commonTestUtils.createFirstStockLocationIfNotExists()]);
}).then(function(resp) {
  return commonTestUtils.createSomeItems();
}).then(function(resp) {
  return ItemModel.findAll({
    raw: true
  });
}).then(function(allItem) {
  console.log(allItem);
  //console.log('Number of Items create=', allItem.length);
});