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
var ItemTaxesModel = require('../../../models').profitGuru_items_taxes;
var ItemDiscountsModel = require('../../../models').profitGuru_discounts;
var ItemQuantitiesModel = require('../../../models').profitGuru_item_quantities;
var peopleModel = require('../../../models').profitGuru_people;
var supplierModel = require('../../../models').profitGuru_suppliers;
var stockLocationsModel = require('../../../models').profitGuru_stock_locations;
var employeesModel = require('../../../models').profitGuru_employees;

var createdPersonId;

describe('Item Model UTS', function() {
  this.timeout(50000);
  before(function() {
    return require('../../../models').sequelize.sync({
      force: true
    });
  });

  it('create ', function() {

    var anItem = profitGuruFaker.getFakerItem();
    anItem.supplier_id = null;
    return ItemModel.create(anItem).then(function(createdItem) {

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

        expect(supplier.company_name).to.equal(aSupplier.company_name);

        return ItemModel.create(anItem).then(function(createdItem) {

          expect(createdItem.item_id).to.not.be.null;
          expect(createdItem.item_id).to.not.equal('');

        });

      });

    });

  });
  it('Item Update  ', function() {

    var anItem = profitGuruFaker.getFakerItem();
    anItem.supplier_id = null;
    return ItemModel.create(anItem).then(function(createdItem) {

      expect(createdItem.item_id).to.not.be.null;
      expect(createdItem.item_id).to.not.equal('');

      return ItemModel.findById(createdItem.item_id).then(function(foundItem) {

        expect(foundItem.item_id).to.not.be.null;
        expect(foundItem.item_id).to.not.equal('');

        var anItem4Update = profitGuruFaker.getFakerItem();
        anItem4Update.name = foundItem.name;
        anItem4Update.item_id = foundItem.item_id;

        return ItemModel.update(anItem4Update, {
          where: {
            item_id: foundItem.item_id
          }
        }).then(function(updatedItem) {

          expect(updatedItem.item_id).to.not.be.null;
          expect(updatedItem.name).to.not.equal(createdItem.name);

        });

      });

    });

  });

  it('delete Item', function() {

    var anItem = profitGuruFaker.getFakerItem();
    anItem.supplier_id = null;
    anItem.name = '4UTShouldBeDeleted'
    var createdItem;
    return ItemModel.create(anItem).then(function(createdItemData) {
      createdItem = createdItemData;
      expect(createdItem.item_id).to.not.be.null;
      expect(createdItem.item_id).to.not.equal('');
      return ItemModel.destroy({
        where: {
          item_id: createdItem.item_id
        }
      }).then(function(resp) {
        return ItemModel.findById(createdItem.item_id).then(function(resp) {
          expect(resp).to.be.null;
        });
      });

    });

  });

});