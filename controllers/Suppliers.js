var q = require('q');
require('errors');
var Suppliers = function() {
    var _self = this;
    var peopleModel = require('../models').profitGuru_people;
    var supplierModel = require('../models').profitGuru_suppliers;
    this.createSupplier = function(requestData) {

        var defered = q.defer();

        //This is handled in Model Validators
        // peopleModel.findAndCountAll({
        //     where: {
        //         phone_number: person_data.phone_number
        //     }
        // }).then(function(personsWithThisPhoneNumber) {
        //     if (personsWithThisPhoneNumber.count === 0) {
        peopleModel.create(requestData).then(function(newPerson) {
            // console.log(newPerson);
            requestData.person_id = newPerson.dataValues.person_id;
            return supplierModel.create(requestData);
        }).then(function(resp) {
            defered.resolve(resp.dataValues);
        }).catch(function(reason) {
            console.log(reason);
            defered.reject(reason);
        });

        return defered.promise;
    };

    this.updateSupplier = function(requestData) {

        var defered = q.defer();
        var response = {};

        peopleModel.update(requestData, {
            where: {
                person_id: requestData.person_id
            }
        }).then(function(personeUpdate) {

            return supplierModel.update(requestData, {
                where: {
                    person_id: requestData.person_id
                }
            });

        }).then(function(resp) {
            response.success = 'SuccesFully Updated Supplier';
            response.result = resp;
            response.supplier_id = requestData.person_id;
            defered.resolve(response);
        });

        return defered.promise;
    };

    this.deleteSupplier = function(requestData) {
        var defered = q.defer();
        peopleModel.destroy({
            where: {
                person_id: requestData.person_id
            }
        }).then(function(response) {
            return supplierModel.destroy({
                where: {
                    person_id: requestData.person_id
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