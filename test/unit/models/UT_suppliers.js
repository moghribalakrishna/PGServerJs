'use strict';

//mocha -R spec UT_suppliers.js  --timeout 200000

//var expect = require('expect.js');
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var profitGuruFaker = require('../../common/profitGuruFaker.js');

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

describe('Supplier Model UTS', function() {
  this.timeout(50000);
  before(function() {
    return require('../../../models').sequelize.sync({
      force: true
    });
  });

  beforeEach(function() {
    this.peopleModel = require('../../../models').profitGuru_people;
    this.supplierModel = require('../../../models').profitGuru_suppliers;
    this.createdPersonId;
  });

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

describe('Supplier Model UTs With Transactions  ', function(done) {

  var transaction;
  var sequlzDB;
  before(function() {
    sequlzDB = require('../../../models');
    return sequlzDB.sequelize.sync()
  });

  beforeEach(function() {
    this.peopleModel = require('../../../models').profitGuru_people;
    this.supplierModel = require('../../../models').profitGuru_suppliers;
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

  //Transaction example https://github.com/sequelize/sequelize/issues/3509
  it('create ', function() {
    var aSupplier = profitGuruFaker.getFakerSupplier();
    sequlzDB.Sequelize.cls.set('transaction', transaction);
    return this.peopleModel.create(aSupplier).bind(this).then(function(person) {
      aSupplier.person_id = person.person_id;

      return this.supplierModel.create(aSupplier).then(function(supplier) {

        expect(supplier.company_name).to.equal(aSupplier.company_name);
      });

    });

  });

});