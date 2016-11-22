'use strict';

//Debug node-debug _mocha -R spec UT_items.js
//var expect = require('expect.js');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var profitGuruFaker = require('../../common/profitGuruFaker.js');
var commonTestUtils = require('../../common/commonUtils.js');

chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;
var assert = chai.assert;
var q = require('q');
var ItemModel = require('../../../models').profitGuru_items;
var salesControllerLib = require('../../../controllers/libraries/salesControllerLib'); //(profitGuruFaker.getFakerSession());
var salesController = require('../../../controllers/Sales'); //(salesControllerLib);
var itemList;

describe('Sales Controller UTS', function() {
  debugger;
  var transaction;
  var sequlzDB;
  //loading Sales classes
  //var salesControllerLib = salesControllerLib(profitGuruFaker.getFakerSession());
  //var salesController = salesController(salesControllerLib);

  this.timeout(500000);

  before(function() {
    sequlzDB = require('../../../models');
    return sequlzDB.sequelize.sync({
      force: true
    }).then(function(resp) {
      return q.all(commonTestUtils.createFirstEmployeeIfNotExists(), commonTestUtils.createFirstStockLocationIfNotExists());
    }).then(function(resp) {
      return commonTestUtils.createSomeItems();
    }).then(function(resp) {
      return ItemModel.all().then(function(allItem) {
        itemList = allItem;
        //console.log('Number of Items create=', allItem.length);
      });
    });

  });

  beforeEach(function() {
    return sequlzDB.sequelize
      .transaction({
        autocommit: false
      })
      .then(function(t) {
        transaction = t;
      });
  });

  afterEach(function() {
    transaction.rollback();
  });

  after(function() {
    sequlzDB.sequelize.drop();
  });

  it('add Item to Cart', function() {

    // salesControllerLib = new salesControllerLib(profitGuruFaker.getFakerSession());
    salesController = new salesController(profitGuruFaker.getFakerSession());

    console.log('Adding ItemId=', itemList[0].dataValues.item_id)
    salesController.addItem({
      item: itemList[0].dataValues.item_id
    });
  });

});