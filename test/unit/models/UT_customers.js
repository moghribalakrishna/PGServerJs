/*
 *       promises used incorrectly. need to correct
 *       Separate model and controllers ut
 */

(function() {
  'use strict';

  //mocha -R spec UT_customers.js  --timeout 200000
  var q = require('q');
  var Sequelize = require("sequelize");
  var chai = require("chai");
  var chaiAsPromised = require("chai-as-promised");

  chai.use(chaiAsPromised);
  chai.should();
  var expect = chai.expect;
  var assert = chai.assert;
  var models = require('../../../models');
  var profitGuruFaker = require('../../common/profitGuruFaker.js');
  var utils = require('../../common/Utils.js');
  var onErrorFunc = function(err) {
    expect(1).to.equal(0);
  };

  describe('Customers UTS', function() {
    before(function() {
      return models.sequelize.sync();
    });

    beforeEach(function() {
      this.peopleModel = models.profitGuru_people;
      this.customersModel = models.profitGuru_customers;
      this.personID = -1;
    });

    describe('Customer Model UTS', function() {

      // it('create people', function() {
      //   this.faker_person = profitGuruFaker.getFakerPerson();
      //   return this.peopleModel.create(this.faker_person).bind(this).then(function(resp) {
      //     return this.peopleModel.findAll().then(function(resp) {
      //       console.log(resp);
      //     });
      //   });
      // });

      // xit('list all people', function() {
      //   return this.peopleModel.findAll().then(function(resp) {
      //     console.log(resp);
      //   });
      // });

      it('create', function() {

        this.faker_person = profitGuruFaker.getFakerPerson();
        return this.peopleModel.create(this.faker_person).bind(this).then(function(createdPerson) {
          expect(createdPerson.person_id).to.not.equal(null);
          expect(createdPerson.person_id).to.not.equal('');
          expect(utils.compareObject(this.faker_person, createdPerson.dataValues)).to.equal(true);

          this.faker_customer_config = profitGuruFaker.getFakerCustomerConfig();
          this.faker_customer_config.person_id = createdPerson.person_id;
          this.personID = createdPerson.person_id;
          return this.customersModel.create(this.faker_customer_config).bind(this).then(function(createdCustomer) {
            expect(utils.compareObject(this.faker_customer_config, createdCustomer.dataValues)).to.equal(true);
          });
        });

      });

      it('create person with same phone number', function() {

        return this.peopleModel.create(this.faker_person).bind(this).then(function(createdPerson) {
          expect(createdPerson).to.equal.null;
        }).catch(Sequelize.ValidationError, function(err) {
          console.log('ValidationError');
        }).catch(function(err) {
          expect(1).to.equal(0);
        });

      });

      it('update ( first name and company name )', function() {
        //TODO make this UT independent , i.e ite dependent on previous UTs for update
        this.faker_customer_config.company_name = 'profitGuru';
        this.faker_person.first_name = 'Gajanan';
        delete this.faker_customer_config.person_id;

        return this.peopleModel.update(this.faker_person, {
          where: {
            person_id: this.personID
          }
        }).bind(this).then(function(updatedPerson) {
          expect(1).to.equal(updatedPerson[0]);
          var defered = q.defer();
          var queryInfoArray = [];

          queryInfoArray.push(this.peopleModel.findById(this.personID).bind(this).then(function(resp) {
            expect(utils.compareObject(this.faker_person, resp.dataValues)).to.equal(true);
          }));

          queryInfoArray.push(this.customersModel.update(this.faker_customer_config, {
            where: {
              person_id: this.personID
            }
          }).bind(this).then(function(updatedCustomer) {
            this.faker_customer_config.person_id = updatedCustomer.person_id;
            expect(1).to.equal(updatedCustomer[0]);

            return this.customersModel.findAll({
              where: {
                person_id: this.personID
              }
            }).bind(this).then(function(resp) {
              expect(resp.length).to.equal(1);
              this.faker_customer_config.person_id = this.personID;
              expect(utils.compareObject(this.faker_customer_config, resp[0].dataValues)).to.equal(true);
            });
          }));

          q.all(queryInfoArray).then(function(resp) {
            defered.resolve(resp);
          }).catch(function(err) {
            defered.reject(err);
          });

          return defered.promise;
        });
      });

      it('delete Customer', function() {
        return this.peopleModel.destroy({
          where: {
            person_id: this.personID
          }
        }).bind(this).then(function(personRowsAffected) {
          expect(1).to.equal(personRowsAffected);
          var defered = q.defer();
          var queryInfoArray = [];

          queryInfoArray.push(this.customersModel.destroy({
            where: {
              person_id: this.personID
            }
          }).bind(this).then(function(customerRowsAffected) {
            return this.customersModel.findById(this.personID).then(function(customer) {
              expect(customer).to.equal(null);
            });
          }));

          queryInfoArray.push(this.peopleModel.findById(this.personID).then(function(person) {
            expect(person).to.equal(null);
          }));

          q.all(queryInfoArray).then(function(resp) {
            defered.resolve(resp);
          }).catch(function(err) {
            defered.reject(err);
          });

          return defered.promise;
        });
      });

      it('transaction example', function() {
        var transPersonID = -1;
        var shouldThrowInCatch = false;
        var sequelizeT = models.sequelize;
        var peopleModel = models.profitGuru_people;
        return sequelizeT.transaction(function(t) {
          var faker_person = profitGuruFaker.getFakerPerson();
          return peopleModel.create(faker_person).then(function(createdPerson) {
            expect(createdPerson.person_id).to.not.equal(null);
            expect(createdPerson.person_id).to.not.equal('');
            expect(utils.compareObject(faker_person, createdPerson.dataValues)).to.equal(true);
            transPersonID = createdPerson.person_id;
            shouldThrowInCatch = true;
            throw new Error('Rolling back mangaged transaction by throwing error'); //To rollback transaction
          });
        }).then(function(resp) {
          console.log('transaction complete');
          console.log(resp);
        }).catch(function(err) {
          expect(shouldThrowInCatch).to.equal(true);
          expect(transPersonID).to.not.equal(-1);
          //checking if transaction has rolled back the commit
          return peopleModel.findAll({
            where: {
              person_id: transPersonID
            }
          }).then(function(resp) {
            expect(resp.length).to.equal(0);
          });
        });

      });

      // xit('customers query', function() {
      //   var queryJson = {};
      //   // queryJson.where = {
      //   //   person_id: 4
      //   // };
      //   queryJson.include = [{
      //     model: this.peopleModel,
      //     where: {
      //       person_id: 1
      //     }
      //   }];
      //   return this.customersModel.findAndCountAll(queryJson).then(function(resp) {
      //     console.log(resp);
      //     // if (resp.length !== 0)
      //     //   console.log(resp[0].dataValues.profitGuru_person);
      //   });
      // });

    });
  });

  describe('Customer Controller UTs  ', function(done) {

    var customersController = require('../../../controllers/Customers');
    var peopleModel = models.profitGuru_people;
    var customersModel = models.profitGuru_customers;

    var faker_person = profitGuruFaker.getFakerPerson();
    var faker_customer_config = profitGuruFaker.getFakerCustomerConfig();
    var createdCustomerID = -1;

    before(function() {
      return models.sequelize.sync();
    });

    beforeEach(function() {});

    it('create ', function() {
      var customerData = utils.mergeObjects([faker_person, faker_customer_config]);
      return customersController.createCustomer(customerData).then(function(resp) {
        expect(resp.hasOwnProperty('customer_id')).to.equal(true);
        createdCustomerID = resp.customer_id;

        var defered = q.defer();
        var promisesArray = [];
        var queryJson = {
          where: {
            person_id: createdCustomerID
          }
        };
        promisesArray.push(peopleModel.findAll(queryJson).then(function(resp) {
          expect(resp.length).to.equal(1);
          expect(utils.compareObject(faker_person, resp[0].dataValues)).to.equal(true);
        }));

        promisesArray.push(customersModel.findAll(queryJson).then(function(resp) {
          expect(resp.length).to.equal(1);
          expect(utils.compareObject(faker_customer_config, resp[0].dataValues)).to.equal(true);
        }));

        q.all(promisesArray).then(function(resp) {
          defered.resolve(resp);
        }).catch(function(err) {
          defered.reject(err);
        });

        return defered.promise;
      });
    });

    it('update ', function() {
      faker_person.last_name = 'Dhoom 3';
      faker_customer_config.company_name = 'Dhoom Series';
      var customerData = utils.mergeObjects([faker_person, faker_customer_config]);
      customerData.person_id = createdCustomerID;
      return customersController.updateCustomer(customerData).then(function(resp) {
        expect(resp.hasOwnProperty('customer_id')).to.equal(true);
        var defered = q.defer();
        var promisesArray = [];
        var queryJson = {
          where: {
            person_id: createdCustomerID
          }
        };

        promisesArray.push(peopleModel.findAll(queryJson).then(function(resp) {
          expect(resp.length).to.equal(1);
          expect(utils.compareObject(faker_person, resp[0].dataValues)).to.equal(true);
        }));

        promisesArray.push(customersModel.findAll(queryJson).then(function(resp) {
          expect(resp.length).to.equal(1);
          expect(utils.compareObject(faker_customer_config, resp[0].dataValues)).to.equal(true);
        }));

        q.all(promisesArray).then(function(resp) {
          defered.resolve(resp);
        }).catch(function(err) {
          defered.reject(err);
        });

        return defered.promise;
      });
    });

    it('should not create user with existing phone_number ', function() {
      var customerData = utils.mergeObjects([faker_person, faker_customer_config]);
      return customersController.createCustomer(customerData).then(function(resp) {
        expect(resp.hasOwnProperty('customer_id')).to.equal(true);
        expect(resp.customer_id).to.equal(-1);
      });
    });

    it('Delete Customer ', function() {
      var param = {
        person_id: createdCustomerID
      };
      return customersController.deleteCustomer(param).then(function(deleteStatus) {
        return customersController.getCustomer(createdCustomerID).then(function(result) {
          expect(result).to.equal(null);
        });
      });

    });
  });

})();