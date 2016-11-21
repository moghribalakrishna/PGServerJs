'use strict';

//Debug node-debug _mocha -R spec UT_items.js
//var expect = require('expect.js');
var chai = require("chai");
var log = console.log;
//var chalk = require('chalk');

var chaiAsPromised = require("chai-as-promised");
var profitGuruFaker = require('../../common/profitGuruFaker.js');
var commonTestUtils = require('../../common/commonUtils.js');
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;
var assert = chai.assert;
var q = require('q');
var Models = require('../../../models');
var ItemModel = Models.profitGuru_items;
var ItemTaxesModel = Models.profitGuru_items_taxes;
var ItemDiscountsModel = Models.profitGuru_discounts;
var ItemQuantitiesModel = Models.profitGuru_item_quantities;
var peopleModel = Models.profitGuru_people;
var supplierModel = Models.profitGuru_suppliers;
var stockLocationsModel = Models.profitGuru_stock_locations;
var employeesModel = Models.profitGuru_employees;
var ItemController = require('../../../controllers/Items');
var createdPersonId;

describe('Item Controller UTS', function() {
  var transaction;
  var sequlzDB;

  this.timeout(50000);

  before(function() {
    sequlzDB = require('../../../models');
    return sequlzDB.sequelize.sync({
      force: true
    }).then(function(resp) {
      return q.all(commonTestUtils.createFirstEmployeeIfNotExists(), commonTestUtils.createFirstStockLocationIfNotExists());
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

  it('create Item', function() {

    var anItem = profitGuruFaker.getFakerItem();
    anItem.supplier_id = null;
    sequlzDB.Sequelize.cls.set('transaction', transaction);
    return ItemController.createItem(anItem).then(function(createdItem) {

      expect(createdItem.item_id).to.not.be.null;
      expect(createdItem.item_id).to.not.equal('');

    });

  });

  it('create Item with supplier_id ', function() {
    var anItem = profitGuruFaker.getFakerItem();

    var aSupplier = profitGuruFaker.getFakerSupplier();
    return peopleModel.create(aSupplier).then(function(person) {
      expect(person.person_id).to.be.a('number')
      anItem.supplier_id = aSupplier.person_id = person.person_id;

      return supplierModel.create(aSupplier).then(function(supplier) {
        sequlzDB.Sequelize.cls.set('transaction', transaction);
        return ItemController.createItem(anItem).then(function(createdItem) {

          expect(createdItem.item_id).to.not.be.null;
          expect(createdItem.item_id).to.not.equal('');

        });

      });

    });

  });

  it('Item Update  ', function() {

    var anItem = profitGuruFaker.getFakerItem();
    anItem.supplier_id = null;
    return ItemController.createItem(anItem).then(function(createdItem) {
      console.log(createdItem);
      expect(createdItem.item_id).to.not.be.null;
      expect(createdItem.item_id).to.not.equal('');

      console.log(createdItem.item_id);
      return ItemModel.findById(createdItem.item_id).then(function(foundItem) {

        expect(foundItem.item_id).to.not.be.null;
        expect(foundItem.item_id).to.not.equal('');

        var anItem4Update = profitGuruFaker.getFakerItem();
        //anItem4Update.item_number = createdItem.item_number;
        //anItem4Update.name = foundItem.name;
        anItem4Update.item_id = foundItem.item_id;

        return ItemController.updateItem(anItem4Update, {
          where: {
            item_id: foundItem.item_id
          }
        }).then(function(updatedItem) {

          expect(updatedItem.item_id).to.not.be.null;
          //expect(updatedItem.name).to.not.equal(createdItem.name);

        });

      });

    });

  });

  it('delete Item', function() {

    var anItem = profitGuruFaker.getFakerItem();
    anItem.supplier_id = null;
    anItem.name = '4UTShouldBeDeleted';

    var createdItem;
    return ItemController.createItem(anItem).then(function(createdItemData) {
      createdItem = createdItemData;
      expect(createdItem.item_id).to.not.be.null;
      expect(createdItem.item_id).to.not.equal('');
      return ItemController.deleteItem({
        item_id: createdItem.item_id
      }).then(function(resp) {
        return ItemModel.findById(createdItem.item_id).then(function(resp) {
          expect(resp).to.be.null;
        });
      });

    });

  });

  it('Get All Item Info from Associations', function() {
    var anItem = profitGuruFaker.getFakerItem();

    var aSupplier = profitGuruFaker.getFakerSupplier();
    return peopleModel.create(aSupplier).then(function(person) {
      expect(person.person_id).to.be.a('number')
      anItem.supplier_id = aSupplier.person_id = person.person_id;

      return supplierModel.create(aSupplier).then(function(supplier) {
        // log(chalk.green('aSupplier', aSupplier));
        anItem.supplier_id = supplier.person_id;
        // sequlzDB.Sequelize.cls.set('transaction', transaction);
        return ItemController.createItem(anItem).then(function(createdItem) {

          expect(createdItem.item_id).to.not.be.null;
          expect(createdItem.item_id).to.not.equal('');

          return ItemModel.find({
            include: [{
              model: Models.profitGuru_suppliers,
            }, {
              model: Models.profitGuru_inventory,
            }, {
              model: Models.profitGuru_item_quantities,
            }, {
              model: Models.profitGuru_discounts,
            }],
            where: {
              item_id: createdItem.item_id
            }
          });
        }).then(function(ItemsCompleteInfo) {
          expect(ItemsCompleteInfo).to.not.be.null;
          expect(ItemsCompleteInfo.dataValues.item_id).to.not.be.null;
          //This has the belongs to relationShip so, its not array
          expect(ItemsCompleteInfo.profitGuru_supplier.dataValues).to.not.be.null;
          //console.log(ItemsCompleteInfo);
          expect(ItemsCompleteInfo.profitGuru_inventories.length).to.equal(1);
          expect(ItemsCompleteInfo.profitGuru_item_quantities.length).to.equal(1);
          expect(ItemsCompleteInfo.profitGuru_discounts.length).to.equal(1);
        });

      });

    });

  });


  it.only('Get All Item Info from Associations', function() {
    var anItem = profitGuruFaker.getFakerItem();

    var aSupplier = profitGuruFaker.getFakerSupplier();
    return peopleModel.create(aSupplier).then(function(person) {
      expect(person.person_id).to.be.a('number')
      anItem.supplier_id = aSupplier.person_id = person.person_id;

      return supplierModel.create(aSupplier).then(function(supplier) {
        // log(chalk.green('aSupplier', aSupplier));
        anItem.supplier_id = supplier.person_id;
        // sequlzDB.Sequelize.cls.set('transaction', transaction);
        return ItemController.createItem(anItem).then(function(createdItem) {

          expect(createdItem.item_id).to.not.be.null;
          expect(createdItem.item_id).to.not.equal('');

          return ItemModel.getThisItemInfo(createdItem.item_id);
        }).then(function(ItemsCompleteInfo) {
          expect(ItemsCompleteInfo).to.not.be.null;
          //expect(ItemsCompleteInfo.item_id).to.not.be.null;
          console.log(ItemsCompleteInfo);
          // //This has the belongs to relationShip so, its not array
          // expect(ItemsCompleteInfo.profitGuru_supplier.dataValues).to.not.be.null;

          // expect(ItemsCompleteInfo.profitGuru_inventories.length).to.equal(1);
          // expect(ItemsCompleteInfo.profitGuru_item_quantities.length).to.equal(1);
          // expect(ItemsCompleteInfo.profitGuru_discounts.length).to.equal(1);
          console.log('thisItemInfo.profitGuru_discount.discount', ItemsCompleteInfo.profitGuru_discount.dataValues.discount);
          console.log('thisItemInfo.profitGuru_item_quantities.profitGuru_stock_location.item_location', ItemsCompleteInfo.profitGuru_item_quantities[0].dataValues.profitGuru_stock_location.dataValues.location_name)
          console.log('thisItemInfo.profitGuru_item_quantities.quantity', ItemsCompleteInfo.profitGuru_item_quantities[0].dataValues.quantity);


        });

      });

    });

  });

});