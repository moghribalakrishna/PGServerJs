/*jshint sub:true*/
var ItemModel = require('../models').profitGuru_items;
var ItemTaxesModel = require('../models').profitGuru_items_taxes;
var ItemDiscountsModel = require('../models').profitGuru_discounts;
var ItemQuantitiesModel = require('../models').profitGuru_item_quantities;

var Items = function() {

    function isUndefinedOrNull(arg) {
        return arg === undefined || arg === '';
    }
    this.createItem = function(requestData) {
        var defered = q.defer();
        var response = {};

        if (!isUndefinedOrNull(requestData['item_id'])) {
            response.error = 'Item asked to create already has an item_id=' + requestData['item_id'];
            defered.reject(response);
        }

        var successDis = false;
        var successAllTaxes = false;
        //var item_id = requestData['item_id'] === '' ? -1 : requestData['item_id'];
        requestData['1_quantity'] = requestData['quantity'] ? requestData['quantity'] : '';
        var upload_success;

        var Item_discount = requestData['discount'];
        var loyaltyPerc = requestData['loyaltyPerc'];
        //TODO Use moment for this
        var date_expry = requestData['expiry'] === '' ? date_create('0000-00-00 00:00:00') : date_create(requestData['expiry']);
        var Expiry_date = date_format(date_expry, 'Y/m/d');

        var ItemNprice = requestData['itemNprice'];
        var Barcode = requestData['item_number'] === '' ? 0 : requestData['item_number'];

        var item_data = {
            'name': requestData['name'],
            'ItemType': requestData['ItemType'] ? requestData['ItemType'] : '',
            'description': requestData['description'] ? requestData['description'] : '',
            'category': requestData['category'],
            'supplier_id': requestData['supplier_id'] === 0 ? null : requestData['supplier_id'],
            'item_number': requestData['item_number'] === '' ? 0 : requestData['item_number'],
            'cost_price': requestData['cost_price'],
            'unit_price': requestData['itemNprice'] === 0 ? requestData['unit_price'] : 0,
            'reorder_level': requestData['reorder_level'] === null ? 0 : requestData['reorder_level'],
            'receiving_quantity': requestData['receiving_quantity'],
            'allow_alt_description': requestData['allow_alt_description'] === null ? 0 : requestData['allow_alt_description'],
            'is_serialized': requestData['is_serialized'] === null ? 0 : requestData['is_serialized'],
            'isprepared': requestData['isprepared'] === null ? 'false' : requestData['isprepared'],
            'issellable': requestData['issellable'] === null ? 'false' : requestData['issellable'],
            'isbought': requestData['isbought'] === null ? 'false' : requestData['isbought'],
            'deleted': requestData['is_deleted'] === null ? '' : requestData['is_deleted'],
            'custom1': requestData['custom1'] ? requestData['custom1'] : '',
            'custom2': requestData['custom2'] === null ? '' : requestData['custom2'],
            'custom3': requestData['custom3'] === null ? '' : requestData['custom3'],
            'custom4': requestData['custom4'] === null ? '' : requestData['custom4'],
            'custom5': requestData['custom5'] === null ? '' : requestData['custom5'],
            'custom6': requestData['custom6'] === null ? '' : requestData['custom6'],
            'custom7': requestData['custom7'] === null ? '' : requestData['custom7'],
            'custom8': requestData['custom8'] === null ? '' : requestData['custom8'],
            'custom9': requestData['custom9'] === null ? '' : requestData['custom9'],
            'custom10': requestData['custom10'] === null ? '' : requestData['custom10']
        };

        // ItemModel.isItemExists(Barcode, requestData['name']).then(function(isItemExists) {});

        //TODO get the logged in Employee
        var employee_id = this.Employee.get_logged_in_employee_info().person_id;

        if (saveItem4table === true && this.Item.save(item_data)) {

            var items_taxes_data = [];

            var tax_names;
            tax_names = {
                0: requestData['tax_name_1'],
                1: requestData['tax_name_2']
            };
            var tax_percents;
            tax_percents = {
                0: requestData['tax_percent_1'],
                1: requestData['tax_percent_2']
            };

            var k;
            for (k = 0; k < count(tax_percents); k++) {
                if (is_numeric(tax_percents[k])) {
                    items_taxes_data.push({
                        'name': tax_names[k],
                        'percent': tax_percents[k]
                    });
                }
            }
            //TODO use ItemTaxesModel
            Item_taxes.save(items_taxes_data, item_id);
            var items_all_taxes = [];
            items_all_taxes.push({
                'tax1_name': requestData['tax_name_1'],
                'tax1_percent': requestData['tax_percent_1'],
                'tax2_name': requestData['tax_name_2'],
                'tax2_percent': requestData['tax_percent_2']
            });

            // Todo use ItemTaxesModel, ######find out why their is saveAllTaxes###
            successAllTaxes &= this.Item_taxes.saveAllTaxes(items_all_taxes, item_id, new_item);

            //TODO use ItemDiscountsModel
            successDis &= this.Item_taxes.save_discount(Item_discount, loyaltyPerc, Expiry_date, ItemNprice, item_id, new_item);
            //Save item quantity
            var stock_locations;
            stock_locations = this.Stock_location.get_undeleted_all().result_array();
            var _key_;
            for (_key_ in stock_locations) {
                var location_data;
                location_data = stock_locations[_key_];
                var updated_quantity;
                updated_quantity = requestData[location_data['location_id'] + '_quantity'];
                var location_detail;
                location_detail = {
                    'item_id': item_id,
                    'location_id': location_data['location_id'],
                    'quantity': updated_quantity,
                    'reorder_level': item_data['reorder_level']
                };
                var item_quantity;

                //TODO use ItemQuantitiesModel
                item_quantity = this.Item_quantity.get_item_quantity(item_id, location_data['location_id']);
                if (item_quantity.quantity != updated_quantity || new_item) {
                    success &= this.Item_quantity.save(location_detail, item_id, location_data['location_id']);
                    var inv_data;
                    inv_data = {
                        'trans_date': date('Y-m-d H:i:s'),
                        'trans_items': item_id,
                        'trans_user': employee_id,
                        'trans_location': location_data['location_id'],
                        'trans_comment': this.lang.line('items_manually_editing_of_quantity'),
                        'trans_inventory': updated_quantity - item_quantity.quantity
                    };
                    success &= this.Inventory.insert(inv_data);
                }
            }
            if (success && upload_success) {

                var success_message = 'items_successful_' + (new_item ? 'adding' : 'updating') + ' ' + item_data['name'];

                console.log(json_encode({
                    'message': success_message
                }));
                //TODO now Add the Item to couch
            } else {
                var error_message = 'items_error_adding_updating' + ' ' + item_data['name'];
                console.log(json_encode({
                    'message': error_message
                }));
            }
        } else {

            var itemExistsError;
            itemExistsError = {};
            if (saveItem4table === false) {
                itemExistsError['itemExists'] = 'itemExists';
                console.log(json_encode({
                    'itemExists': itemExistsError
                }));
            } else {
                console.log(json_encode({
                    'message': 'items_error_adding_updating' + ' ' + item_data['name']
                }));
            }
        }

        return defered.promise;
    };

    this.updateItem = function(requestData) {
        var successDis = false;
        var successAllTaxes = false;
        var item_id = requestData['item_id'] === '' ? -1 : requestData['item_id'];
        requestData['1_quantity'] = requestData['quantity'] ? requestData['quantity'] : '';
        var upload_success;

        //Save item data

        var Item_discount = requestData['discount'];
        var loyaltyPerc = requestData['loyaltyPerc'];
        var date_expry = requestData['expiry'] === '' ? date_create('0000-00-00 00:00:00') : date_create(requestData['expiry']);
        var Expiry_date = date_format(date_expry, 'Y/m/d');
        var ItemNprice = requestData['itemNprice'];
        var Barcode = requestData['item_number'] === '' ? 0 : requestData['item_number'];
        var itemExits = this.Item.exists_Item(Barcode, requestData['name']);
        var saveItem4table;
        var data = {};

        if (itemExits === 0) {
            saveItem4table = true;

        } else {
            if (requestData['editingExistingItem'] === 'true') {
                saveItem4table = true;
            } else {
                saveItem4table = false;

                data['itemExists'] = 'itemExists';
            }
        }
        var item_data;
        item_data = {
            'name': requestData['name'],
            'ItemType': requestData['ItemType'] ? requestData['ItemType'] : '',
            'description': requestData['description'] ? requestData['description'] : '',
            'category': requestData['category'],
            'supplier_id': requestData['supplier_id'] === 0 ? null : requestData['supplier_id'],
            'item_number': requestData['item_number'] === '' ? 0 : requestData['item_number'],
            'cost_price': requestData['cost_price'],
            'unit_price': requestData['itemNprice'] === 0 ? requestData['unit_price'] : 0,
            'reorder_level': requestData['reorder_level'] === null ? 0 : requestData['reorder_level'],
            'receiving_quantity': requestData['receiving_quantity'],
            'allow_alt_description': requestData['allow_alt_description'] === null ? 0 : requestData['allow_alt_description'],
            'is_serialized': requestData['is_serialized'] === null ? 0 : requestData['is_serialized'],
            'isprepared': requestData['isprepared'] === null ? 'false' : requestData['isprepared'],
            'issellable': requestData['issellable'] === null ? 'false' : requestData['issellable'],
            'isbought': requestData['isbought'] === null ? 'false' : requestData['isbought'],
            'deleted': requestData['is_deleted'] === null ? '' : requestData['is_deleted'],
            'custom1': requestData['custom1'] ? requestData['custom1'] : '',
            'custom2': requestData['custom2'] === null ? '' : requestData['custom2'],
            'custom3': requestData['custom3'] === null ? '' : requestData['custom3'],
            'custom4': requestData['custom4'] === null ? '' : requestData['custom4'],
            'custom5': requestData['custom5'] === null ? '' : requestData['custom5'],
            'custom6': requestData['custom6'] === null ? '' : requestData['custom6'],
            'custom7': requestData['custom7'] === null ? '' : requestData['custom7'],
            'custom8': requestData['custom8'] === null ? '' : requestData['custom8'],
            'custom9': requestData['custom9'] === null ? '' : requestData['custom9'],
            'custom10': requestData['custom10'] === null ? '' : requestData['custom10']
        };
        if (!empty(upload_data['orig_name'])) {
            item_data['pic_id'] = upload_data['raw_name'];
        }
        var employee_id;
        employee_id = this.Employee.get_logged_in_employee_info().person_id;

        var cur_item_info;
        cur_item_info = this.Item.get_info(item_id);
        if (saveItem4table === true && this.Item.save(item_data, item_id)) {
            var success;
            success = true;
            var new_item;
            new_item = false;
            //New item
            if (item_id == -1) {
                item_id = item_data['item_id'];
                new_item = true;
            }
            /*$items_taxes_data = array();
            $tax_names = $requestData ['tax_names'];
            $tax_percents = $requestData ['tax_percents'];*/
            var items_taxes_data = [];

            var tax_names;
            tax_names = {
                0: requestData['tax_name_1'],
                1: requestData['tax_name_2']
            };
            var tax_percents;
            tax_percents = {
                0: requestData['tax_percent_1'],
                1: requestData['tax_percent_2']
            };
            var k;
            for (k = 0; k < count(tax_percents); k++) {
                if (is_numeric(tax_percents[k])) {
                    items_taxes_data.push({
                        'name': tax_names[k],
                        'percent': tax_percents[k]
                    });
                }
            }
            success &= this.Item_taxes.save(items_taxes_data, item_id);
            var items_all_taxes = [];
            items_all_taxes.push({
                'tax1_name': requestData['tax_name_1'],
                'tax1_percent': requestData['tax_percent_1'],
                'tax2_name': requestData['tax_name_2'],
                'tax2_percent': requestData['tax_percent_2']
            });

            successAllTaxes &= this.Item_taxes.saveAllTaxes(items_all_taxes, item_id, new_item);
            successDis &= this.Item_taxes.save_discount(Item_discount, loyaltyPerc, Expiry_date, ItemNprice, item_id, new_item);
            //Save item quantity
            var stock_locations;
            stock_locations = this.Stock_location.get_undeleted_all().result_array();
            var _key_;
            for (_key_ in stock_locations) {
                var location_data;
                location_data = stock_locations[_key_];
                var updated_quantity;
                updated_quantity = requestData[location_data['location_id'] + '_quantity'];
                var location_detail;
                location_detail = {
                    'item_id': item_id,
                    'location_id': location_data['location_id'],
                    'quantity': updated_quantity,
                    'reorder_level': item_data['reorder_level']
                };
                var item_quantity;
                item_quantity = this.Item_quantity.get_item_quantity(item_id, location_data['location_id']);
                if (item_quantity.quantity != updated_quantity || new_item) {
                    success &= this.Item_quantity.save(location_detail, item_id, location_data['location_id']);
                    var inv_data;
                    inv_data = {
                        'trans_date': date('Y-m-d H:i:s'),
                        'trans_items': item_id,
                        'trans_user': employee_id,
                        'trans_location': location_data['location_id'],
                        'trans_comment': this.lang.line('items_manually_editing_of_quantity'),
                        'trans_inventory': updated_quantity - item_quantity.quantity
                    };
                    success &= this.Inventory.insert(inv_data);
                }
            }
            if (success && upload_success) {

                var success_message = 'items_successful_' + (new_item ? 'adding' : 'updating') + ' ' + item_data['name'];

                console.log(json_encode({
                    'message': success_message
                }));
                //NodeServerUrl taken from index.html
                // if (new_item) {
                //     var url;
                //     url = NodeServerUrl.
                //     '?event=itemSave&id='.item_id.
                //     '&location_id='.location_data['location_id'].
                //     '&appType='.APPTYPE;
                //     url = urlencode(url);
                //     file_get_contents(urldecode(url));
                // } else {
                //     url = NodeServerUrl.
                //     '?event=itemEdit&id='.item_id.
                //     '&location_id='.location_data['location_id'].
                //     '&appType='.APPTYPE;
                //     url = urlencode(url);
                //     file_get_contents(urldecode(url));
                // }
            } else {
                var error_message = 'items_error_adding_updating' + ' ' + item_data['name'];
                console.log(json_encode({
                    'message': error_message
                }));
            }
        } else {

            var itemExistsError;
            itemExistsError = {};
            if (saveItem4table === false) {
                itemExistsError['itemExists'] = 'itemExists';
                console.log(json_encode({
                    'itemExists': itemExistsError
                }));
            } else {
                console.log(json_encode({
                    'message': 'items_error_adding_updating' + ' ' + item_data['name']
                }));
            }
        }
    };
    this.deleteItemsRestApi = function() {
        var items_to_delete, requestData;
        items_to_delete = requestData['item_id'];
        if (this.Item.delete_list(items_to_delete)) {
            //TODO update couch
            var message = 'items_successful_deleted' + ' ' + count(items_to_delete);
            console.log(json_encode({
                'success': true,
                'message': message
            }));
        } else {
            console.log(json_encode({
                'success': false,
                'message': this.lang.line('items_cannot_be_deleted')
            }));
        }
        /*$oldcwd = getcwd();
        		//chdir($oldcwd+"/sendEvents2NodeServer");
        	shell_exec($oldcwd.'/sendEvents2NodeServer/sendEvent2NodeServer.js itemDelete '.$oldcwd. "> /dev/null 2>/dev/null &" );*/
    };
    this.saveInventoryRestApi = function() {
        var item_id, requestData;
        item_id = requestData['item_id'] === '' ? -1 : requestData['item_id'];
        var employee_id;
        employee_id = this.Employee.get_logged_in_employee_info().person_id;
        var cur_item_info;
        cur_item_info = this.Item.get_info(item_id);
        var location_id;
        location_id = requestData['stock_location'];
        var inv_data;
        inv_data = {
            'trans_date': date('Y-m-d H:i:s'),
            'trans_items': item_id,
            'trans_user': employee_id,
            'trans_location': location_id,
            'trans_comment': requestData['trans_comment'] ? requestData['trans_comment'] : '',
            'trans_inventory': requestData['newquantity']
        };
        this.Inventory.insert(inv_data);
        //Update stock quantity
        var item_quantity;
        item_quantity = this.Item_quantity.get_item_quantity(item_id, location_id);
        var item_quantity_data;
        item_quantity_data = {
            'item_id': item_id,
            'location_id': location_id,
            'quantity': item_quantity.quantity + requestData['newquantity'],
            'reorder_level': cur_item_info.reorder_level
        };
        if (this.Item_quantity.save(item_quantity_data, item_id, location_id)) {
            // var url;
            // url = NodeServerUrl.
            // '?event=itemUpdateInventory&id='.item_id.
            // '&location_id='.location_id.
            // '&appType='.APPTYPE;
            // url = urlencode(url);
            // file_get_contents(urldecode(url));
            console.log(json_encode({
                'message': 'items_successful_updating'
            }));
        } else {
            console.log(json_encode({
                'message': this.lang.line('items_error_adding_updating', data = 'data')
            }));
        }
    };
    this.getItemsEditRestApi = function() {
        var a;
        a = 3;
        var item_id, requestData;
        item_id = requestData['item_id_edit'];
        //$item_id=27;
        var data;
        data['item_info'] = this.Item.get_info(item_id);
        data['item_tax_info'] = this.Item_taxes.get_info(item_id);
        data['discount'] = this.Item_taxes.get_item_Discount(item_id);
        var suppliers;
        suppliers = {
            '': this.lang.line('items_none')
        };
        var _key_;
        for (_key_ in this.Supplier.get_all().result_array()) {
            var row;
            row = this.Supplier.get_all().result_array()[_key_];
            suppliers[row['person_id']] = row['company_name'];
        }
        data['suppliers'] = suppliers;
        data['selected_supplier'] = this.Item.get_info(item_id).supplier_id;
        data['default_tax_1_rate'] = item_id == -1 ? this.Appconfig.get('default_tax_1_rate') : '';
        data['default_tax_2_rate'] = item_id == -1 ? this.Appconfig.get('default_tax_2_rate') : '';
        var locations_data;
        locations_data = this.Stock_location.get_undeleted_all().result_array();
        for (_key_ in locations_data) {
            var location;
            location = locations_data[_key_];
            var quantity;
            quantity = this.Item_quantity.get_item_quantity(item_id, location['location_id']).quantity;
            quantity = item_id == -1 ? null : quantity;
            var location_array;
            location_array[location['location_id']] = {
                'location_name': location['location_name'],
                'quantity': quantity
            };
            data['stock_locations'] = location_array;
        }
        console.log(json_encode({
            'data': data
        }));
    };
    this.getInvetaryDetailRestApi = function() {
        var a;
        a = 3;
        var item_id, requestData;
        item_id = requestData['item_id_edit'];
        var location_id;
        location_id = requestData['location_id'];
        var inventory;
        inventory = this.Inventory.get_inventory_data_for_item(item_id, location_id).result_array();
        var inventoryJson;
        inventoryJson = {};
        var _key_;
        var employee;
        for (_key_ in inventory) {
            var row;
            row = inventory[_key_];
            var person_id;
            person_id = row['trans_user'];

            employee = this.Employee.get_info(person_id);
        }
        var data;
        data['employee'] = employee;
        data['inventory'] = inventory;
        data['item_info'] = this.Item.get_info(item_id);
        data['stock_locations'] = {};
        var stock_locations;
        stock_locations = this.Stock_location.get_undeleted_all().result_array();
        for (_key_ in stock_locations) {
            var location_data;
            location_data = stock_locations[_key_];
            data['stock_locations'][location_data['location_id']] = location_data['location_name'];
            data['item_quantities'][location_data['location_id']] = this.Item_quantity.get_item_quantity(item_id, location_data['location_id']).quantity;
        }
        console.log(json_encode({
            'data': data
        }));
    };
    return Items;
};

module.exports = new Items();