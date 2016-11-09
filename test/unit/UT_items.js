'use strict';

//Debug node-debug _mocha -R spec UT_items.js
//var expect = require('expect.js');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var profitGuruFaker = require('../common/profitGuruFaker.js');
chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;
var assert = chai.assert;

var ItemModel = require('../../models').profitGuru_items;
var ItemTaxesModel = require('../../models').profitGuru_items_taxes;
var ItemDiscountsModel = require('../../models').profitGuru_discounts;
var ItemQuantitiesModel = require('../../models').profitGuru_item_quantities;
var peopleModel = require('../../models').profitGuru_people;
var supplierModel = require('../../models').profitGuru_suppliers;

var createdPersonId;

describe('Item UTS', function() {
  debugger;
  before(function() {
    return require('../../models').sequelize.sync();
  });

  beforeEach(function() {


  });

  describe('Item Model UTS', function() {
    it.only('create ', function() {

      var anItem = profitGuruFaker.getFakerItem();
      anItem.supplier_id = null;
      return ItemModel.create(anItem).then(function(supplier) {

        //expect(supplier.company_name).to.equal(aSupplier.company_name);
      });

    });

    it('create ', function() {
      var anItem = profitGuruFaker.getFakerItem();

      var aSupplier = profitGuruFaker.getFakerSupplier();
      return peopleModel.create(aSupplier).then(function(person) {
        expect(person.person_id).to.be.a('number')
        createdPersonId = aSupplier.person_id = person.person_id;

        return supplierModel.create(aSupplier).then(function(supplier) {

          expect(supplier.company_name).to.equal(aSupplier.company_name);
        });

      });

    });


    // it('update ( first name and company name )', function() {

    //   supplier_data.company_name = 'profitGuru';
    //   person_data.first_name = 'Gajanan';

    //   delete supplier_data.person_id;

    //   return this.peopleModel.update(person_data, {
    //     where: {
    //       person_id: this.createdPersonId
    //     }
    //   }).bind(this).then(function(updatedPerson) {

    //     //console.log('updatedPerson', updatedPerson);
    //     expect(1).to.equal(updatedPerson[0]);

    //     return this.supplierModel.update(supplier_data, {
    //       where: {
    //         person_id: this.createdPersonId
    //       }
    //     }).bind(this).then(function(supplier) {
    //       console.log(supplier);
    //       expect(1).to.equal(supplier[0]);
    //     });

    //   });

    // });


    // it('delete Items', function() {

    //   return this.peopleModel.destroy({
    //     where: {
    //       person_id: this.createdPersonId
    //     }
    //   }).bind(this).then(function(instance) {

    //     return this.supplierModel.destroy({
    //       where: {
    //         person_id: this.createdPersonId
    //       }
    //     }).bind(this).then(function(supplier) {

    //       return this.supplierModel.findById(this.createdPersonId).bind(this);

    //     }).then(function(supDeleteResult) {

    //       return this.peopleModel.findById(this.createdPersonId).bind(this);
    //     }).then(function(pepDeleteResult) {
    //       //  console.log('perDeleteResult', perDeleteResult);
    //     });

    //   });

    // });

  });
});