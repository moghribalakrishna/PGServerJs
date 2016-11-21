/*jshint sub:true*/
var ItemModel = require('../models').profitGuru_items;
var ItemTaxesModel = require('../models').profitGuru_items_taxes;
var ItemDiscountsModel = require('../models').profitGuru_discounts;
var ItemQuantitiesModel = require('../models').profitGuru_item_quantities;
var ItemInventoryModel = require('../models').profitGuru_inventory;
var moment = require('moment');
var q = require('q');
var sequelize = require('../models').sequelize;
var Items = function() {

    function isUndefinedOrNull(arg) {
        return arg === undefined || arg === '';
    }

    this.createItem = function(requestData) {
        var defered = q.defer();
        var createResponse = {};

        if (!isUndefinedOrNull(requestData.item_id)) {
            createResponse.error = 'Item asked to create already has an item_id=' + requestData['item_id'];
            defered.reject(createResponse);
        }

        // var Barcode = requestData['item_number'] === '' ? 0 : requestData['item_number'];

        // var item_data = {
        //     'name': requestData['name'],
        //     'ItemType': requestData['ItemType'] ? requestData['ItemType'] : '',
        //     'description': requestData['description'] ? requestData['description'] : '',
        //     'category': requestData['category'],
        //     'supplier_id': requestData['supplier_id'] === 0 ? null : requestData['supplier_id'],
        //     'item_number': requestData['item_number'] === '' ? 0 : requestData['item_number'],
        //     'cost_price': requestData['cost_price'],
        //     'unit_price': requestData['itemNprice'] === 0 ? requestData['unit_price'] : 0,
        //     'reorder_level': requestData['reorder_level'] === null ? 0 : requestData['reorder_level'],
        //     'receiving_quantity': requestData['receiving_quantity'],
        //     'allow_alt_description': requestData['allow_alt_description'] === null ? 0 : requestData['allow_alt_description'],
        //     'is_serialized': requestData['is_serialized'] === null ? 0 : requestData['is_serialized'],
        //     'isprepared': requestData['isprepared'] === null ? 'false' : requestData['isprepared'],
        //     'issellable': requestData['issellable'] === null ? 'false' : requestData['issellable'],
        //     'isbought': requestData['isbought'] === null ? 'false' : requestData['isbought'],
        //     'expiry_date': requestData['expiry']
        // };

        ItemModel.isItemExists(requestData['item_number'], requestData['name']).then(function(isItemExists) {
            if (isItemExists) {
                createResponse.error = 'Item with Barcode=' + requestData['item_number'] + ' And ' + requestData['name'] + ' already Exists';
                defered.reject(createResponse);
            } else {

                return sequelize.transaction(function(t) {
                    return ItemModel.create(requestData).then(function(createdItem) {
                        var ItemTaxsPromisList = [];
                        for (var k = 0; k < requestData['tax_percents'].length; k++) {
                            ItemTaxsPromisList.push(
                                ItemTaxesModel.create({
                                    'name': requestData['tax_names'][k],
                                    'percent': requestData['tax_percents'][k],
                                    'item_id': createdItem.item_id
                                }));
                        }

                        return q.all(ItemTaxsPromisList).then(function(respList) {
                            //TODO following expiry is for discounts, get it from client
                            var discountData = {
                                'discount': requestData['discount'],
                                'loyaltyPerc': requestData['loyaltyPerc'],
                                'expiry_date': requestData['discount_expiry'],
                                //'expiry_date': null,
                                'itemNprice': requestData['itemNprice'],
                                'item_id': createdItem.item_id
                            };
                            return ItemDiscountsModel.create(discountData).then(function(createdItemDiscounts) {
                                var itemQuantityData = {
                                    'item_id': createdItem.item_id,
                                    'location_id': requestData['location_id'],
                                    'quantity': requestData['quantity'],
                                    'reorder_level': requestData['reorder_level']
                                };

                                //TODO get the logged in Employee
                                var employee_id = 1; //this.Employee.get_logged_in_employee_info().person_id;
                                return ItemQuantitiesModel.create(itemQuantityData).then(function(createdItemQuantities) {
                                    var itemInvData = {
                                        'trans_date': moment().toDate(),
                                        'trans_items': createdItem.item_id,
                                        'trans_user': employee_id,
                                        'trans_location': requestData['location_id'],
                                        'trans_comment': 'quantity added During Item Create',
                                        'trans_inventory': requestData['quantity']
                                    };
                                    return ItemInventoryModel.create(itemInvData).then(function(createdInventory) {
                                        createResponse.success = 'SuccesFully New Item is Created';
                                        createResponse.item_id = createdItem.item_id;
                                        defered.resolve(createResponse);
                                    });
                                });

                            });
                        });

                    });

                });
            }
        });

        return defered.promise;
    };
    this.updateItem = function(requestData) {
        var defered = q.defer();
        var updateResponse = {};

        ItemModel.findById(requestData['item_id']).then(function(isItemExists) {
            if (!isItemExists) {
                updateResponse.error = 'Item with item_id=' + requestData['item_id'] + ' does not Exists';
                defered.reject(updateResponse);
            } else {

                return sequelize.transaction(function(t) {
                    return ItemModel.update(requestData, {
                        where: {
                            item_id: requestData.item_id
                        }
                    }).then(function(updatedItem) {

                        return ItemTaxesModel.destroy({
                            where: {
                                item_id: requestData['item_id']
                            }
                        }).then(function(response) {
                            var ItemTaxsPromisList = [];
                            for (var k = 0; k < requestData['tax_percents'].length; k++) {
                                ItemTaxsPromisList.push(
                                    ItemTaxesModel.create({
                                        'name': requestData['tax_names'][k],
                                        'percent': requestData['tax_percents'][k],
                                        'item_id': requestData['item_id']
                                    }));
                            }

                            return q.all(ItemTaxsPromisList).then(function(respList) {
                                var discountData = {
                                    'discount': requestData['discount'],
                                    'loyaltyPerc': requestData['loyaltyPerc'],
                                    'expiry_date': requestData['discount_expiry'],
                                    'itemNprice': requestData['itemNprice'],
                                    'item_id': requestData['item_id']
                                };

                                return ItemDiscountsModel.destroy({
                                    where: {
                                        item_id: requestData['item_id']
                                    }
                                }).then(function(response) {
                                    return ItemDiscountsModel.create(discountData).then(function(createdItemDiscounts) {

                                        ItemQuantitiesModel.findById(requestData['item_id']).then(function(storedItemQuantities) {
                                            if (storedItemQuantities.quantity != requestData['quantity']) {
                                                var itemQuantityData = {
                                                    'location_id': requestData['location_id'],
                                                    'quantity': requestData['quantity'],
                                                    'reorder_level': requestData['reorder_level']
                                                };

                                                //TODO get the logged in Employee
                                                var employee_id = 1; //this.Employee.get_logged_in_employee_info().person_id;
                                                return ItemQuantitiesModel.update(itemQuantityData, {
                                                    where: {
                                                        item_id: requestData['item_id']
                                                    }
                                                }).then(function(createdItemQuantities) {
                                                    var itemInvData = {
                                                        'trans_date': moment().toDate(),
                                                        'trans_items': requestData.item_id,
                                                        'trans_user': employee_id,
                                                        'trans_location': requestData['location_id'],
                                                        'trans_comment': 'quantity added During Item Create',
                                                        'trans_inventory': requestData['quantity']
                                                    };
                                                    return ItemInventoryModel.create(itemInvData).then(function(createdInventory) {
                                                        updateResponse.success = 'SuccesFully Item is Updated';
                                                        updateResponse.item_id = requestData.item_id;
                                                        defered.resolve(updateResponse);
                                                    });
                                                });
                                            }
                                        });
                                    });
                                });
                            });
                        });

                    });
                });
            }
        });

        return defered.promise;
    };

    this.deleteItem = function(requestData) {

        //TODO verify whether cascading is going through

        var deleteResponse = {};
        var defered = q.defer();
        ItemModel.destroy({
            where: {
                item_id: requestData.item_id
            }
        }).then(function(response) {
            deleteResponse.item_id = requestData.item_id;
            deleteResponse.msg = 'SuccesFully deleted ' + requestData.item_id;
            defered.resolve(deleteResponse);

        }).catch(function(reason) {
            deleteResponse.error = reason;
            defered.reject(deleteResponse);
        });

        return defered.promise;
    };

};

module.exports = new Items();