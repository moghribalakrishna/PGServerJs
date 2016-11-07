//not implemented phptojs\JsPrinter\JsPrinter::pStmt_Nop
var ItemModel  = require('../models').profitGuru_items;

var Items = (function() {
    function Items() {
        window.__IS_INHERITANCE__ = false;
    }
    Items.prototype.saveItemRestApi = function(_REQUEST) {
        //$item_id=$_REQUEST ['item_id'];
        var successDis;
        successDis = false;
        var successAllTaxes;
        successAllTaxes = false;
        var item_id, _REQUEST;
        item_id = _REQUEST['item_id'] == '' ? -1 : _REQUEST['item_id'];
        _REQUEST['1_quantity'] = _REQUEST['quantity'] ? _REQUEST['quantity'] : '';
        var upload_success;
        //TODO BK
        //upload_success = this._handle_image_upload();
        //var upload_data;
        //upload_data = this.upload.data();

        //Save item data
        var Item_discount;
        Item_discount = _REQUEST['discount'];
        var loyaltyPerc;
        loyaltyPerc = _REQUEST['loyaltyPerc'];
        //$Expiry_date = $_REQUEST['expiry'] ? $_REQUEST['expiry'] : null;
        var date_expry;
        date_expry = _REQUEST['expiry'] == '' ? date_create('0000-00-00 00:00:00') : date_create(_REQUEST['expiry']);
        var Expiry_date;
        Expiry_date = date_format(date_expry, 'Y/m/d');
        var ItemNprice;
        ItemNprice = _REQUEST['itemNprice'];
        var Barcode;
        Barcode = _REQUEST['item_number'] == '' ? 0 : _REQUEST['item_number'];
        var itemExits;
        itemExits = this.Item.exists_Item(Barcode, _REQUEST['name']);
        if (itemExits == 0) {
            var saveItem4table;
            saveItem4table = true;
        } else {
            if (_REQUEST['editingExistingItem'] === 'true') {
                saveItem4table = true;
            } else {
                saveItem4table = false;
                var data;
                data['itemExists'] = 'itemExists';
            }
        }
        var item_data;
        item_data = {
            'name': _REQUEST['name'],
            'ItemType': _REQUEST['ItemType'] ? _REQUEST['ItemType'] : '',
            'description': _REQUEST['description'] ? _REQUEST['description'] : '',
            'category': _REQUEST['category'],
            'supplier_id': _REQUEST['supplier_id'] == 0 ? null : _REQUEST['supplier_id'],
            'item_number': _REQUEST['item_number'] == '' ? 0 : _REQUEST['item_number'],
            'cost_price': _REQUEST['cost_price'],
            'unit_price': _REQUEST['itemNprice'] == 0 ? _REQUEST['unit_price'] : 0,
            'reorder_level': _REQUEST['reorder_level'] == null ? 0 : _REQUEST['reorder_level'],
            'receiving_quantity': _REQUEST['receiving_quantity'],
            'allow_alt_description': _REQUEST['allow_alt_description'] == null ? 0 : _REQUEST['allow_alt_description'],
            'is_serialized': _REQUEST['is_serialized'] == null ? 0 : _REQUEST['is_serialized'],
            'isprepared': _REQUEST['isprepared'] == null ? 'false' : _REQUEST['isprepared'],
            'issellable': _REQUEST['issellable'] == null ? 'false' : _REQUEST['issellable'],
            'isbought': _REQUEST['isbought'] == null ? 'false' : _REQUEST['isbought'],
            'deleted': _REQUEST['is_deleted'] == null ? '' : _REQUEST['is_deleted'],
            'custom1': _REQUEST['custom1'] ? _REQUEST['custom1'] : '',
            'custom2': _REQUEST['custom2'] == null ? '' : _REQUEST['custom2'],
            'custom3': _REQUEST['custom3'] == null ? '' : _REQUEST['custom3'],
            'custom4': _REQUEST['custom4'] == null ? '' : _REQUEST['custom4'],
            'custom5': _REQUEST['custom5'] == null ? '' : _REQUEST['custom5'],
            'custom6': _REQUEST['custom6'] == null ? '' : _REQUEST['custom6'],
            'custom7': _REQUEST['custom7'] == null ? '' : _REQUEST['custom7'],
            'custom8': _REQUEST['custom8'] == null ? '' : _REQUEST['custom8'],
            'custom9': _REQUEST['custom9'] == null ? '' : _REQUEST['custom9'],
            'custom10': _REQUEST['custom10'] == null ? '' : _REQUEST['custom10']
        };
        if (!empty(upload_data['orig_name'])) {
            item_data['pic_id'] = upload_data['raw_name'];
        }
        var employee_id;
        employee_id = this.Employee.get_logged_in_employee_info().person_id;
        var cur_item_info;
        cur_item_info = this.Item.get_info(item_id);
        if (saveItem4table == true && this.Item.save(item_data, item_id)) {
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
            $tax_names = $_REQUEST ['tax_names'];
            $tax_percents = $_REQUEST ['tax_percents'];*/
            var items_taxes_data;
            items_taxes_data = {};
            var tax_names;
            tax_names = {
                0: _REQUEST['tax_name_1'],
                1: _REQUEST['tax_name_2']
            };
            var tax_percents;
            tax_percents = {
                0: _REQUEST['tax_percent_1'],
                1: _REQUEST['tax_percent_2']
            };
            var k;
            for (k = 0; k < count(tax_percents); k++) {
                if (is_numeric(tax_percents[k])) {
                    items_taxes_data[] = {
                        'name': tax_names[k],
                        'percent': tax_percents[k]
                    };
                }
            }
            success &= this.Item_taxes.save(items_taxes_data, item_id);
            var items_all_taxes;
            items_all_taxes[] = {
                'tax1_name': _REQUEST['tax_name_1'],
                'tax1_percent': _REQUEST['tax_percent_1'],
                'tax2_name': _REQUEST['tax_name_2'],
                'tax2_percent': _REQUEST['tax_percent_2']
            };
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
                updated_quantity = _REQUEST[location_data['location_id'].
                    '_quantity'];
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
                var success_message;
                success_message = this.lang.line('items_successful_'.(new_item ? 'adding' : 'updating')).
                ' '.item_data['name'];
                //echo json_encode(array('success'=>true,'message'=>$success_message,'item_id'=>$item_id));
                //echo json_encode(array('message'=>$success_message));
                console.log(json_encode({
                    'message': success_message
                }));
                //NodeServerUrl taken from index.html
                if (new_item) {
                    var url;
                    url = NodeServerUrl.
                    '?event=itemSave&id='.item_id.
                    '&location_id='.location_data['location_id'].
                    '&appType='.APPTYPE;
                    url = urlencode(url);
                    file_get_contents(urldecode(url));
                } else {
                    url = NodeServerUrl.
                    '?event=itemEdit&id='.item_id.
                    '&location_id='.location_data['location_id'].
                    '&appType='.APPTYPE;
                    url = urlencode(url);
                    file_get_contents(urldecode(url));
                }
            } else {
                var error_message;
                error_message = upload_success ? this.lang.line('items_error_adding_updating').
                ' '.item_data['name']: this.upload.display_errors();
                /*echo json_encode(array('success'=>false,
                'message'=>$error_message,'item_id'=>$item_id)); */
                console.log(json_encode({
                    'message': error_message
                }));
            }
        } else {
            /*echo json_encode(array('success'=>false,
            	'message'=>$this->lang->line('items_error_adding_updating').' '
            	.$item_data['name'],'item_id'=>-1));*/
            var itemExistsError;
            itemExistsError = {};
            if (saveItem4table == false) {
                itemExistsError['itemExists'] = 'itemExists';
                console.log(json_encode({
                    'itemExists': itemExistsError
                }));
            } else {
                console.log(json_encode({
                    'message': this.lang.line('items_error_adding_updating').
                    ' '.item_data['name']
                }));
            }
        }
    };
    Items.prototype.deleteItemsRestApi = function() {
        var items_to_delete, _REQUEST;
        items_to_delete = _REQUEST['item_id'];
        if (this.Item.delete_list(items_to_delete)) {
            var url;
            url = NodeServerUrl.
            '?event=itemDelete&id='.items_to_delete.
            '&appType='.APPTYPE;
            url = urlencode(url);
            file_get_contents(urldecode(url));
            console.log(json_encode({
                'success': true,
                'message': this.lang.line('items_successful_deleted').
                ' '.count(items_to_delete).
                ' '.this.lang.line('items_one_or_multiple')
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
    Items.prototype.saveInventoryRestApi = function() {
        var item_id, _REQUEST;
        item_id = _REQUEST['item_id'] == '' ? -1 : _REQUEST['item_id'];
        var employee_id;
        employee_id = this.Employee.get_logged_in_employee_info().person_id;
        var cur_item_info;
        cur_item_info = this.Item.get_info(item_id);
        var location_id;
        location_id = _REQUEST['stock_location'];
        var inv_data;
        inv_data = {
            'trans_date': date('Y-m-d H:i:s'),
            'trans_items': item_id,
            'trans_user': employee_id,
            'trans_location': location_id,
            'trans_comment': _REQUEST['trans_comment'] ? _REQUEST['trans_comment'] : '',
            'trans_inventory': _REQUEST['newquantity']
        };
        this.Inventory.insert(inv_data);
        //Update stock quantity
        var item_quantity;
        item_quantity = this.Item_quantity.get_item_quantity(item_id, location_id);
        var item_quantity_data;
        item_quantity_data = {
            'item_id': item_id,
            'location_id': location_id,
            'quantity': item_quantity.quantity + _REQUEST['newquantity'],
            'reorder_level': cur_item_info.reorder_level
        };
        if (this.Item_quantity.save(item_quantity_data, item_id, location_id)) {
            var url;
            url = NodeServerUrl.
            '?event=itemUpdateInventory&id='.item_id.
            '&location_id='.location_id.
            '&appType='.APPTYPE;
            url = urlencode(url);
            file_get_contents(urldecode(url));
            console.log(json_encode({
                'message': this.lang.line('items_successful_updating')
            }));
        } else {
            console.log(json_encode({
                'message': this.lang.line('items_error_adding_updating', data = 'data')
            }));
        }
    };
    Items.prototype.getItemsEditRestApi = function() {
        var a;
        a = 3;
        var item_id, _REQUEST;
        item_id = _REQUEST['item_id_edit'];
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
    Items.prototype.getInvetaryDetailRestApi = function() {
        var a;
        a = 3;
        var item_id, _REQUEST;
        item_id = _REQUEST['item_id_edit'];
        var location_id;
        location_id = _REQUEST['location_id'];
        var inventory;
        inventory = this.Inventory.get_inventory_data_for_item(item_id, location_id).result_array();
        var inventoryJson;
        inventoryJson = {};
        var _key_;
        for (_key_ in inventory) {
            var row;
            row = inventory[_key_];
            var person_id;
            person_id = row['trans_user'];
            var employee;
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
})();
