var q = require('q');
require('errors');
var Suppliers = function() {
    var _self = this;
    var peopleModel = require('../models').profitGuru_people;
    var supplierModel = require('../models').profitGuru_suppliers;
    this.createSupplier = function(requestData) {

        var defered = q.defer();

        var person_data = {
            first_name: requestData.first_name,
            last_name: requestData.last_name,
            gender: requestData.gender,
            email: requestData.email,
            phone_number: requestData.phone_number,
            address_1: requestData.address_1,
            address_2: requestData.address_2,
            city: requestData.city,
            state: requestData.state,
            zip: requestData.zip,
            country: requestData.country,
            comments: requestData.comments === null ? '' : requestData.comments
        };

        var supplier_data = {
            company_name: requestData.company_name,
            agency_name: requestData.agency_name,
            account_number: requestData.account_number === '' ? null : requestData.account_number
        };

        peopleModel.findAndCountAll({
            where: {
                phone_number: person_data.phone_number
            }
        }).then(function(personsWithThisPhoneNumber) {
            if (personsWithThisPhoneNumber.count === 0) {
                peopleModel.create(person_data).then(function(newPerson) {
                    // console.log(newPerson);
                    supplier_data.person_id = newPerson.dataValues.person_id;
                    return supplierModel.create(supplier_data);
                }).then(function(resp) {
                    defered.resolve(resp.dataValues);
                }).catch(function(reason) {
                    console.log(reason);
                    defered.reject(reason);
                });
            } else {
                // throw new errors.Http401Error();
                defered.reject('User with ' + person_data.phone_number + ' Already Exists');
            }

        }).catch(function(reason) {
            // response.error = ' Error While adding Supplier';
            //response.result = reason;
            defered.reject(' Error While adding Supplier' + reason);
        });
        return defered.promise;

    };

    this.updateSupplier = function(requestData) {

        var defered = q.defer();
        var response = {};
        var supplier_id = requestData.person_id === '' ? -1 : requestData.person_id;

        var person_data = {
            first_name: requestData.first_name,
            last_name: requestData.last_name,
            gender: requestData.gender,
            email: requestData.email,
            phone_number: requestData.phone_number,
            address_1: requestData.address_1,
            address_2: requestData.address_2,
            city: requestData.city,
            state: requestData.state,
            zip: requestData.zip,
            country: requestData.country,
            comments: requestData.comments === null ? '' : requestData.comments
        };
        var supplier_data = {
            company_name: requestData.company_name,
            agency_name: requestData.agency_name,
            account_number: requestData.account_number === '' ? null : requestData.account_number
        };

        peopleModel.isPersonExistsWithThisPhoneNumber(person_data.phone_number).then(function(personsWithThisPhoneNumber) {
            if (personsWithThisPhoneNumber.count <= 1) {
                peopleModel.update(person_data, {
                    where: {
                        id: supplier_id
                    }
                }).then(function(personeUpdate) {

                    return supplierModel.update(supplier_data, {
                        where: {
                            id: supplier_id
                        }
                    });

                }).then(function(resp) {
                    response.success = 'SuccesFully Updated Supplier';
                    response.result = resp;
                    defered.resolve(response);
                });

            } else {
                response.error = 'Other User with ' + person_data.phone_number + ' Already Exists';
                response.result = personsWithThisPhoneNumber.rows;
                defered.reject(response);
            }
        }).catch(function(reason) {
            response.error = 'Error While Updating Supplier';
            response.result = reason;
            defered.reject(response);
        });
    };

    this.deleteSupplier = function(supplierId) {
        var defered = q.defer();
        peopleModel.destroy({
            where: {
                person_id: supplierId
            }
        }).then(function(response) {
            return supplierModel.destroy({
                where: {
                    person_id: supplierId
                }
            });
        }).then(function(result) {
            console.log(result);
            defered.resolve(result);

        }).catch(function(reason) {
            defered.reject(reason);
        });

        return defered.promise;
    };

    this.getSupplier = function(supplierId) {
        return supplierModel.findById(supplierId);
    };
};
module.exports = new Suppliers();