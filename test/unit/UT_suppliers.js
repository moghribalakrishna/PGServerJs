'use strict';

//Debug node-debug _mocha -R spec suppliers.js
//var expect = require('expect.js');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
chai.should();
var expect = chai.expect;
var assert = chai.assert;
var person_data = {
  first_name: 'ganesh',
  last_name: 'mogare',
  gender: 'M',
  email: 'ganesh.mogare@gmail.com',
  phone_number: '8888489777',
  address_1: 'Dandle 1',
  address_2: 'dandeli 2',
  city: 'Dandeli',
  state: 'Karnataka',
  zip: '561329',
  country: 'India',
  comments: 'A sample supplier'
};
var supplier_data = {
  company_name: 'AlienHu',
  agency_name: 'some agency',
  account_number: 123
};


describe('Suppliers UTS', function() {
  before(function() {
    return require('../../models').sequelize.sync();
  });

  beforeEach(function() {
    this.peopleModel = require('../../models').profitGuru_people;
    this.supplierModel = require('../../models').profitGuru_suppliers;
    this.createdPersonId;
  });

  describe('Supplier Model UTS', function() {

    it('create ', function() {

      return this.peopleModel.create(person_data).bind(this).then(function(person) {
        this.createdPersonId = supplier_data.person_id = person.person_id;
        this.createdPersonId = person.person_id;

        return this.supplierModel.create(supplier_data).then(function(supplier) {

          expect(supplier.company_name).to.equal('AlienHu');
        });

      });

    });

    it('update ( first name and company name )', function() {

      supplier_data.company_name = 'profitGuru';
      person_data.first_name = 'Gajanan';

      delete supplier_data.person_id;

      return this.peopleModel.update(person_data, {
        where: {
          person_id: this.createdPersonId
        }
      }).bind(this).then(function(updatedPerson) {

        //console.log('updatedPerson', updatedPerson);
        expect(1).to.equal(updatedPerson[0]);

        return this.supplierModel.update(supplier_data, {
          where: {
            person_id: this.createdPersonId
          }
        }).bind(this).then(function(supplier) {
          console.log(supplier);
          expect(1).to.equal(supplier[0]);
        });

      });

    });


    it('delete Supplier', function() {

      return this.peopleModel.destroy({
        where: {
          person_id: this.createdPersonId
        }
      }).bind(this).then(function(instance) {

        return this.supplierModel.destroy({
          where: {
            person_id: this.createdPersonId
          }
        }).bind(this).then(function(supplier) {

          return this.supplierModel.findById(this.createdPersonId).bind(this);

        }).then(function(supDeleteResult) {

          return this.peopleModel.findById(this.createdPersonId).bind(this);
        }).then(function(pepDeleteResult) {
          //  console.log('perDeleteResult', perDeleteResult);
        });

      });

    });

  });
});


describe.only('Supplier Model UTs With Transactions  ', function(done) {
  debugger;
  var transaction;
  var sequlzDB;
  before(function() {
    sequlzDB = require('../../models');
    return sequlzDB.sequelize.sync()
  });
  beforeEach(function() {
    this.peopleModel = require('../../models').profitGuru_people;
    this.supplierModel = require('../../models').profitGuru_suppliers;
    this.createdPersonId;

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

  // it('should create instance of Thing', () => {
  //   db._namespace.set('transaction', transaction);

  //   return db.Thing.create({ // Voila, transaction is binded
  //     name: 'foo'
  //   }).then(thing => {
  //     expect(thing.id).to.be.a('number');
  //     expect(thing.name).to.be.eql('foo');
  //   });
  // });
  it('create ', function() {

    sequlzDB.Sequelize.cls.set('transaction', transaction);
    return this.peopleModel.create(person_data).bind(this).then(function(person) {
      this.createdPersonId = supplier_data.person_id = person.person_id;
      this.createdPersonId = person.person_id;

      return this.supplierModel.create(supplier_data).then(function(supplier) {

        expect(supplier.company_name).to.equal('AlienHu');
      });

    });

  });

});

describe('Supplier Controller UTs  ', function(done) {

  var supplierController = require('../../controllers/Suppliers');
  var supplierReqData = {
    first_name: 'vinod',
    last_name: 'sidalani',
    gender: 'M',
    email: 'ganesh.mogare@gmail.com',
    phone_number: '565654451',
    address_1: 'Dandle 1',
    address_2: 'dandeli 2',
    city: 'Dandeli',
    state: 'Karnataka',
    zip: '561329',
    country: 'India',
    comments: 'A sample supplier',
    company_name: 'google',
    agency_name: 'other agency',
    account_number: 321
  };

  var createdSupplierId;

  before(function() {
    return require('../../models').sequelize.sync();
  });

  beforeEach(function() {
    this.peopleModel = require('../../models').profitGuru_people;
    this.supplierModel = require('../../models').profitGuru_suppliers;

  });

  it('create ', function() {

    return supplierController.createSupplier(supplierReqData).then(function(addedSupplier) {
      createdSupplierId = addedSupplier.person_id;
      expect('google').to.equal(addedSupplier.company_name);
    });

  });

  it('should not create user with existing phone_number ', function() {

    return supplierController.createSupplier(supplierReqData).then(function(addedSupplier) {

      expect().fail("should not create user with existing phone_number");

    }).should.be.rejected;

  });

  it('Delete Supplier ', function() {
    console.log('Deleting Supplier with Id=', createdSupplierId);
    return supplierController.deleteSupplier(createdSupplierId).then(function(deleteStatus) {
      return supplierController.getSupplier(createdSupplierId).then(function(result) {
        console.log(result);
      });

    });

  });

});