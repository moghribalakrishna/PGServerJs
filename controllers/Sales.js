/*jshint sub:true*/

module.exports = function(requestSession) {

    var salesController = {};
    //var salesControllerLib = new salesControllerLib(requestSession);
    var salesControllerLib = require('./libraries/salesControllerLib')(requestSession);
    salesController.addItem = function(requestData) {
        return new Promise(function(resolve, reject) {

            var mode = salesControllerLib.get_mode();
            var quantity = mode == 'return' ? -1 : 1;
            var itemLocation = salesControllerLib.getSaleLocation();

            if (mode == 'return') {
                var receiptNumberOrInvoiceNumber = requestData['item'];
                return salesControllerLib.getSaleIdFromReceiptOrInvoiceNumber(receiptNumberOrInvoiceNumber).then(function(saleId) {
                    if (!saleId) {
                        reject(receiptNumberOrInvoiceNumber + ' is not a Valid receiptNumberOrInvoiceNumber');
                    } else {
                        return salesControllerLib.returnEntireSale(saleId).then(function(resp) {

                        });
                    }
                });
            } else {
                var itemIdOrItemKit = requestData['item'];
                return salesControllerLib.isValidItemKit(itemIdOrItemKit).then(function(isItemKit) {
                    if (isItemKit) {
                        return salesControllerLib.addItemKit(itemIdOrItemKit, itemLocation);
                    } else {
                        return salesControllerLib.addItemToCart(itemIdOrItemKit, quantity, itemLocation, this.config.item('default_sales_discount'));
                    }
                });

            }
            data['warning'] = salesControllerLib.out_of_stock(item_id_or_number_or_item_kit_or_receipt, itemLocation);
            this._reload4RestApi(data);

        });
    };

    salesController._reload4RestApi = function(data) {
        data = data || {};
        //TODO
        //var person_info = this.Employee.get_logged_in_employee_info();
        var loggedInEmployeeId = 1;
        data['cart'] = salesControllerLib.get_cart();
        data['modes'] = {
            sale: 'sale',
            return: 'return'
        };
        data['mode'] = salesControllerLib.session.mode;
        //TODO looks this is not needed at client side
        //data['stock_locations'] = this.Stock_location.get_allowed_locations('sales');
        data['stock_location'] = salesControllerLib.session.location_id;
        data['subtotal'] = salesControllerLib.get_subtotal(true);
        data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);

        //Todo we should use taxes filed only, not taxArray
        $data['taxes'] = salesControllerLib.get_taxes();

        //data['taxesArray'] = this.getAllCartItemTaxes();
        data['discount'] = salesControllerLib.get_discount();
        data['total'] = salesControllerLib.get_total();
        data['items_module_allowed'] = this.Employee.has_grant('items', loggedInEmployeeId);
        data['comment'] = salesControllerLib.get_comment();
        data['email_receipt'] = salesControllerLib.get_email_receipt();
        data['payments_total'] = salesControllerLib.get_payments_total();
        data['amount_due'] = salesControllerLib.get_amount_due();
        data['payments'] = salesControllerLib.get_payments();
        data['payment_options'] = {};
        //TODO might have to create new table with payment options and its names
        // data['payment_options'] = {
        //     this.lang.line('sales_cash'): this.lang.line('sales_cash'),
        //     this.lang.line('sales_check'): this.lang.line('sales_check'),
        //     this.lang.line('sales_debit'): this.lang.line('sales_debit'),
        //     this.lang.line('sales_credit'): this.lang.line('sales_credit')
        // };

        var customer_id = salesControllerLib.get_customer();

        var cust_info = '';
        if (customer_id != -1) {
            cust_info = this.Customer.get_info(customer_id);
            data['customer'] = cust_info.first_name + ' ' + cust_info.last_name;
            data['customer_email'] = cust_info.email;
            data['customer_id'] = salesControllerLib.get_customer();
            data['loyalityeligible'] = cust_info.loyalty;
        }
        data['invoice_number'] = this._substitute_invoice_number(cust_info);
        data['invoice_number_enabled'] = salesControllerLib.is_invoice_number_enabled();
        data['print_after_sale'] = salesControllerLib.is_print_after_sale();
        data['payments_cover_total'] = this._payments_cover_total();

    };

    //      function add_paymentRestApi() {
    //         var data;
    //         data = {};
    //         if (requestData['payment_type'] === 'Gift Card') {
    //             if (requestData['giftcardAmt'] <= this.Giftcard.get_giftcard_value(requestData['amount_tendered'])) {
    //                 var requestData, giftcardAmtToRedeem;
    //                 giftcardAmtToRedeem = requestData['giftcardAmt'];
    //             }
    //         } else {
    //             giftcardAmtToRedeem = 0;
    //         }
    //         var payment_type;
    //         payment_type = requestData['payment_type'];
    //         if (payment_type == this.lang.line('sales_giftcard')) {
    //             var payments;
    //             payments = salesControllerLib.get_payments();
    //             var payment_amount;
    //             payment_type = requestData['payment_type'] + ':' + (payment_amount = requestData['amount_tendered']);
    //             var current_payments_with_giftcard;
    //             current_payments_with_giftcard = isset(payments[payment_type]) ? payments[payment_type]['payment_amount'] : 0;
    //             if (this.Giftcard.get_giftcard_value(requestData['amount_tendered']) >= current_payments_with_giftcard + giftcardAmtToRedeem) {
    //                 var cur_giftcard_value;
    //                 cur_giftcard_value = this.Giftcard.get_giftcard_value(requestData['amount_tendered']) - current_payments_with_giftcard;
    //             } else {
    //                 cur_giftcard_value = 0;
    //             }
    //             if (cur_giftcard_value <= 0) {
    //                 data['error'] = this.lang.line('giftcards_remaining_balance', requestData['amount_tendered'], to_currency(this.Giftcard.get_giftcard_value(requestData['amount_tendered'])));
    //                 this._reload(data);
    //                 return;
    //             }
    //             var new_giftcard_value;
    //             new_giftcard_value = this.Giftcard.get_giftcard_value(requestData['amount_tendered']) - salesControllerLib.get_amount_due();
    //             new_giftcard_value = new_giftcard_value >= 0 ? new_giftcard_value : 0;
    //             var value4GiftCard;
    //             value4GiftCard = new_giftcard_value + (this.Giftcard.get_giftcard_value(requestData['amount_tendered']) - giftcardAmtToRedeem);
    //             data['newGiftcardvalue'] = this.Giftcard.get_giftcard_value(requestData['amount_tendered']) - (salesControllerLib.get_payments_total() + giftcardAmtToRedeem);
    //             // $this->Giftcard->newgiftcard_value($requestData ['amount_tendered'],$value4GiftCard);
    //             var abc;
    //             abc = salesControllerLib.set_giftcard_remainder(value4GiftCard);
    //             data['warning'] = this.lang.line('giftcards_remaining_balance', requestData['amount_tendered'], to_currency(new_giftcard_value, true));
    //             payment_amount = min(salesControllerLib.get_amount_due(), giftcardAmtToRedeem);
    //         } else {
    //             payment_amount = requestData['amount_tendered'];
    //         }
    //         if (!salesControllerLib.add_payment(payment_type, payment_amount)) {
    //             data['error'] = 'Unable to Add Payment! Please try again!';
    //         }
    //         this._reload4RestApi(data);
    //     }

    //      function getSalesRestApi() {
    //         this._reload4RestApi();
    //     }
    //     //PHP_OS
    //     function getClientsApi() {
    //         //echo php_uname();
    //         var clients;
    //         clients = thisdebugger.Sale.get_clients();
    //         var clientList;
    //         clientList = {};
    //         var _key_;
    //         for (_key_ in clients.result()) {
    //             var client;
    //             client = clients.result()[_key_];

    //             array_push(clientList, client);
    //         }
    //         console.log(json_encode({
    //             'data': clientList
    //         }));
    //     }

    //     function manageRestApi() {
    //         var only_invoices;
    //         only_invoices = false;
    //         var only_cash;
    //         only_cash = false;
    //         var limit_from;
    //         limit_from = 0;
    //         var person_id;
    //         person_id = this.session.userdata('person_id');
    //         if (!this.Employee.has_grant('reports_sales', person_id)) {
    //             redirect('no_access/sales/reports_sales');
    //         } else {
    //             this.Sale.create_sales_items_temp_table();
    //             var data;
    //             data['controller_name'] = this.get_controller_name();
    //             var lines_per_page;
    //             lines_per_page = this.Appconfig.get('lines_per_page');
    //             var today;
    //             today = date(this.config.item('dateformat'));
    //             //$start_date = $this->input->post('start_date') != null ? $this->input->post('start_date') : $today;
    //             //$start_date = $requestData['start_date'] != null ? $requestData['start_date'] : $today;
    //             var start_date;
    //             start_date = today;
    //             var start_date_formatter;
    //             start_date_formatter = date_create_from_format(this.config.item('dateformat'), start_date);
    //             //$end_date = $requestData['end_date'] != null ? $requestData['end_date'] : $today;
    //             var end_date;
    //             end_date = today;
    //             var end_date_formatter;
    //             end_date_formatter = date_create_from_format(this.config.item('dateformat'), end_date);
    //             var sale_type;
    //             sale_type = 'all';
    //             var location_id;
    //             location_id = 'all';
    //             var isValidReceipt;
    //             isValidReceipt = false;
    //             var search;
    //             search = null;
    //             var filters;
    //             filters = {
    //                 'sale_type': sale_type,
    //                 'location_id': location_id,
    //                 'start_date': start_date_formatter.format('Y-m-d'),
    //                 'end_date': end_date_formatter.format('Y-m-d'),
    //                 'only_invoices': only_invoices,
    //                 'only_cash': only_cash,
    //                 'isValidReceipt': isValidReceipt
    //             };
    //             var sales;
    //             sales = this.Sale.search(search, filters, lines_per_page, limit_from).result_array();
    //             var payments;
    //             payments = this.Sale.get_payments_summary(search, filters);
    //             var total_rows;
    //             total_rows = this.Sale.get_found_rows(search, filters);
    //             data['only_invoices'] = only_invoices;
    //             data['only_cash '] = only_cash;
    //             data['start_date'] = start_date_formatter.format(this.config.item('dateformat'));
    //             data['end_date'] = end_date_formatter.format(this.config.item('dateformat'));
    //             data['links'] = this._initialize_pagination(this.Sale, lines_per_page, limit_from, total_rows, 'manage', only_invoices);
    //             data['manage_table'] = get_sales_manage_table(sales, this);
    //             data['payments_summary'] = get_sales_manage_payments_summary(payments, sales, this);
    //             //$this->load->view($data['controller_name'] . '/manage', $data);
    //             console.log(json_encode({
    //                 'manageData': sales,
    //                 'rowtotal': total_rows,
    //                 'paysummary': payments
    //             }));
    //         }
    //     }

    //     function addCustomer2SaleRestApi() {
    //         //$customer_id = $this->input->post("customer");
    //         var customer_id, requestData;
    //         customer_id = requestData['customer_id'];
    //         salesControllerLib.set_customer(customer_id);
    //         console.log(json_encode({
    //             'succs_customer_id': customer_id
    //         }));
    //     }

    //     function addCustomer2OrdersRestApi() {
    //         //$customer_id = $this->input->post("customer");
    //         var customer_id, requestData;
    //         customer_id = requestData['customer_id'];
    //         salesControllerLib.set_customer(customer_id);
    //         console.log(json_encode({
    //             'succs_customer_id': customer_id
    //         }));
    //     }

    //     function changeModeRestApi() {
    //         var stock_location, requestData;
    //         stock_location = requestData['stock_location'];
    //         if (!stock_location || stock_location == salesControllerLib.get_sale_location()) {
    //             var mode;
    //             mode = requestData['mode'];
    //             salesControllerLib.set_mode(mode);
    //         } else {
    //             if (this.Stock_location.is_allowed_location(stock_location, 'sales')) {
    //                 salesControllerLib.set_sale_location(stock_location);
    //             }
    //         }
    //         this._reload4RestApi();
    //     }

    //     function change_mode() {
    //         var stock_location;
    //         stock_location = this.input.post('stock_location');
    //         if (!stock_location || stock_location == salesControllerLib.get_sale_location()) {
    //             var mode;
    //             mode = this.input.post('mode');
    //             salesControllerLib.set_mode(mode);
    //         } else {
    //             if (this.Stock_location.is_allowed_location(stock_location, 'sales')) {
    //                 salesControllerLib.set_sale_location(stock_location);
    //             }
    //         }
    //         this._reload();
    //     }

    //     function set_comment() {
    //         salesControllerLib.set_comment(this.input.post('comment'));
    //     }

    //     function setCommentRestApi() {
    //         salesControllerLib.set_comment(requestData['comment']);
    //     }

    //     function set_invoice_number() {
    //         salesControllerLib.set_invoice_number(this.input.post('sales_invoice_number'));
    //     }

    //     function setInvoiceNumberRestApi() {
    //         salesControllerLib.set_invoice_number(requestData['sales_invoice_number']);
    //     }

    //     function set_invoice_number_enabled() {
    //         salesControllerLib.set_invoice_number_enabled(this.input.post('sales_invoice_number_enabled'));
    //     }

    //     function setInvoiceNumberEnabledRestApi() {
    //         salesControllerLib.set_invoice_number_enabled(requestData['sales_invoice_number_enabled']);
    //     }

    //     function set_print_after_sale() {
    //         salesControllerLib.set_print_after_sale(this.input.post('sales_print_after_sale'));
    //     }

    //     function setPrintAfterSaleRestApi() {
    //         salesControllerLib.set_print_after_sale(requestData['sales_print_after_sale']);
    //     }

    //     function set_email_receipt() {
    //         salesControllerLib.set_email_receipt(this.input.post('email_receipt'));
    //     }
    //     // Multiple Payments

    //     function add_payment() {
    //         var data;
    //         data = {};
    //         this.form_validation.set_rules('amount_tendered', 'lang:sales_amount_tendered', 'trim|required|numeric');
    //         if (this.form_validation.run() == false) {
    //             if (this.input.post('payment_type') == this.lang.line('sales_gift_card')) {
    //                 data['error'] = this.lang.line('sales_must_enter_numeric_giftcard');
    //             } else {
    //                 data['error'] = this.lang.line('sales_must_enter_numeric');
    //             }
    //             this._reload(data);
    //             return;
    //         }
    //         var payment_type;
    //         payment_type = this.input.post('payment_type');
    //         if (payment_type == this.lang.line('sales_giftcard')) {
    //             var payments;
    //             payments = salesControllerLib.get_payments();
    //             var payment_amount;
    //             payment_type = this.input.post('payment_type').
    //             ':'.(payment_amount = this.input.post('amount_tendered'));
    //             var current_payments_with_giftcard;
    //             current_payments_with_giftcard = isset(payments[payment_type]) ? payments[payment_type]['payment_amount'] : 0;
    //             var cur_giftcard_value;
    //             cur_giftcard_value = this.Giftcard.get_giftcard_value(this.input.post('amount_tendered')) - current_payments_with_giftcard;
    //             if (cur_giftcard_value <= 0) {
    //                 data['error'] = this.lang.line('giftcards_remaining_balance', this.input.post('amount_tendered'), to_currency(this.Giftcard.get_giftcard_value(this.input.post('amount_tendered'))));
    //                 this._reload(data);
    //                 return;
    //             }
    //             var new_giftcard_value;
    //             new_giftcard_value = this.Giftcard.get_giftcard_value(this.input.post('amount_tendered')) - salesControllerLib.get_amount_due();
    //             new_giftcard_value = new_giftcard_value >= 0 ? new_giftcard_value : 0;
    //             salesControllerLib.set_giftcard_remainder(new_giftcard_value);
    //             data['warning'] = this.lang.line('giftcards_remaining_balance', this.input.post('amount_tendered'), to_currency(new_giftcard_value, true));
    //             payment_amount = min(salesControllerLib.get_amount_due(), this.Giftcard.get_giftcard_value(this.input.post('amount_tendered')));
    //         } else {
    //             payment_amount = this.input.post('amount_tendered');
    //         }
    //         if (!salesControllerLib.add_payment(payment_type, payment_amount)) {
    //             data['error'] = 'Unable to Add Payment! Please try again!';
    //         }
    //         this._reload(data);
    //     }
    //     // Multiple Payments
    //     function delete_payment(payment_id) {
    //         salesControllerLib.delete_payment(payment_id);
    //         this._reload();
    //     }

    //     function delete_paymentRestApi() {
    //         //Gift Card:0 //Debit Card //Credit Card
    //         var payment_id, requestData;
    //         payment_id = requestData['payment_id'];
    //         salesControllerLib.delete_payment(payment_id);
    //         this._reload4RestApi();
    //     }

    //     function removeitemRestApi() {
    //         var data;
    //         data = {};
    //         var mode;
    //         mode = salesControllerLib.get_mode();
    //         var item_id_or_number_or_item_kit_or_receipt, requestData;
    //         item_id_or_number_or_item_kit_or_receipt = requestData['item'];
    //         //$item_id_or_number_or_item_kit_or_receipt = $this->input->post("item");
    //         var quantity;
    //         quantity = mode == 'return' ? 1 : -1;
    //         var itemLocation;
    //         itemLocation = salesControllerLib.get_sale_location();
    //         if (mode == 'return' && salesControllerLib.isValidReceipt(item_id_or_number_or_item_kit_or_receipt)) {
    //             salesControllerLib.returnEntireSale(item_id_or_number_or_item_kit_or_receipt);
    //         } else {
    //             if (salesControllerLib.is_valid_item_kit(item_id_or_number_or_item_kit_or_receipt)) {
    //                 salesControllerLib.addItemKit(item_id_or_number_or_item_kit_or_receipt, itemLocation);
    //             } else {
    //                 if (!salesControllerLib.addItemToCart(item_id_or_number_or_item_kit_or_receipt, quantity, itemLocation, this.config.item('default_sales_discount'))) {
    //                     data['error'] = this.lang.line('sales_unable_to_addItemToCart');
    //                 }
    //             }
    //         }
    //         if (salesControllerLib.out_of_stock(item_id_or_number_or_item_kit_or_receipt, itemLocation)) {
    //             data['warning'] = this.lang.line('sales_quantity_less_than_zero');
    //         }
    //         this._reload4RestApi(data);
    //     }

    //     function getEditRestApi() {
    //         var data;
    //         data = {};
    //         var sale_id, requestData;
    //         sale_id = requestData['saleid'];
    //         data['employees'] = {};
    //         var _key_;
    //         for (_key_ in this.Employee.get_all().result()) {
    //             var employee;
    //             employee = this.Employee.get_all().result()[_key_];
    //             data['employees'][] = {
    //                 'emp_id': employee.person_id,
    //                 'emp_name': employee.first_name.
    //                 ' '.employee.last_name
    //             };
    //         }
    //         this.Sale.create_sales_items_temp_table();
    //         var sale_info;
    //         sale_info = this.Sale.get_info(sale_id).row_array();
    //         var person_name;
    //         person_name = sale_info['first_name'].
    //         ' '.sale_info['last_name'];
    //         data['selected_customer'] = !empty(sale_info['customer_id']) ? sale_info['customer_id'].
    //         '|'.person_name: '';
    //         data['my_info'] = sale_info;
    //         //      $this->load->view('sales/form', $data);
    //         console.log(json_encode({
    //             'data': data
    //         }));
    //     }

    //     function add() {
    //         var data;
    //         data = {};
    //         var mode;
    //         mode = salesControllerLib.get_mode();
    //         var item_id_or_number_or_item_kit_or_receipt;
    //         item_id_or_number_or_item_kit_or_receipt = this.input.post('item');
    //         var quantity;
    //         quantity = mode == 'return' ? -1 : 1;
    //         var itemLocation;
    //         itemLocation = salesControllerLib.get_sale_location();
    //         if (mode == 'return' && salesControllerLib.isValidReceipt(item_id_or_number_or_item_kit_or_receipt)) {
    //             salesControllerLib.returnEntireSale(item_id_or_number_or_item_kit_or_receipt);
    //         } else {
    //             if (salesControllerLib.is_valid_item_kit(item_id_or_number_or_item_kit_or_receipt)) {
    //                 salesControllerLib.addItemKit(item_id_or_number_or_item_kit_or_receipt, itemLocation);
    //             } else {
    //                 if (!salesControllerLib.addItemToCart(item_id_or_number_or_item_kit_or_receipt, quantity, itemLocation, this.config.item('default_sales_discount'))) {
    //                     data['error'] = this.lang.line('sales_unable_to_addItemToCart');
    //                 }
    //             }
    //         }
    //         data['warning'] = salesControllerLib.out_of_stock(item_id_or_number_or_item_kit_or_receipt, itemLocation);
    //         this._reload(data);
    //     }

    //     function editItemRestApi() {
    //         var data;
    //         data = {};
    //         this.form_validation.set_rulesRestApi('price', 'lang:items_price', 'required|numeric');
    //         this.form_validation.set_rulesRestApi('quantity', 'lang:items_quantity', 'required|numeric');
    //         this.form_validation.set_rulesRestApi('discount', 'lang:items_discount', 'required|numeric');
    //         var description, requestData;
    //         description = requestData['description'];
    //         var serialnumber;
    //         serialnumber = requestData['serialnumber'];
    //         var price;
    //         price = requestData['price'];
    //         var quantity;
    //         quantity = requestData['quantity'];
    //         var discount;
    //         discount = requestData['discount'];
    //         var itemLocation;
    //         itemLocation = requestData['itemLocation'];
    //         var loyalty4item;
    //         loyalty4item = requestData['loyaltyPerc'] == null ? '0' : requestData['loyaltyPerc'];
    //         var amt4loyalty;
    //         amt4loyalty = price * quantity * loyalty4item / 100;
    //         if (this.form_validation.run() != false) {
    //             salesControllerLib.edit_item(line, description, serialnumber, quantity, discount, price, loyalty4item, amt4loyalty);
    //         } else {
    //             data['error'] = this.lang.line('sales_error_editing_item');
    //         }
    //         data['warning'] = salesControllerLib.out_of_stock(salesControllerLib.get_item_id(line), itemLocation);
    //         this._reload4RestApi(data);
    //     }

    //     function edit_item(line) {
    //         var data;
    //         data = {};
    //         this.form_validation.set_rules('price', 'lang:items_price', 'required|numeric');
    //         this.form_validation.set_rules('quantity', 'lang:items_quantity', 'required|numeric');
    //         this.form_validation.set_rules('discount', 'lang:items_discount', 'required|numeric');
    //         var description;
    //         description = this.input.post('description');
    //         var serialnumber;
    //         serialnumber = this.input.post('serialnumber');
    //         var price;
    //         price = this.input.post('price');
    //         var quantity;
    //         quantity = this.input.post('quantity');
    //         var discount;
    //         discount = this.input.post('discount');
    //         var itemLocation;
    //         itemLocation = this.input.post('location');
    //         if (this.form_validation.run() != false) {
    //             salesControllerLib.edit_item(line, description, serialnumber, quantity, discount, price);
    //         } else {
    //             data['error'] = this.lang.line('sales_error_editing_item');
    //         }
    //         data['warning'] = salesControllerLib.out_of_stock(salesControllerLib.get_item_id(line), itemLocation);
    //         this._reload(data);
    //     }

    //     function delete_item(item_number) {
    //         salesControllerLib.delete_item(item_number);
    //         this._reload();
    //     }

    //     function DeleteItemFromCartRestApi() {
    //         var item_number, requestData;
    //         item_number = requestData['item'];
    //         salesControllerLib.delete_item(item_number);
    //         this._reload4RestApi();
    //     }

    //     function remove_customer() {
    //         salesControllerLib.clear_giftcard_remainder();
    //         salesControllerLib.clear_invoice_number();
    //         salesControllerLib.remove_customer();
    //         this._reload();
    //     }

    //     function completeSaleRestApi() {
    //         var data;
    //         data['cart'] = salesControllerLib.get_cart();
    //         data['subtotal'] = salesControllerLib.get_subtotal();
    //         data['discounted_subtotal'] = salesControllerLib.get_subtotal(true);
    //         data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //         data['taxes'] = salesControllerLib.get_taxes();
    //         data['taxesData'] = this.getAllCartItemTaxes();
    //         data['total'] = salesControllerLib.get_total();
    //         data['discount'] = salesControllerLib.get_discount();
    //         data['receipt_title'] = this.lang.line('sales_receipt');
    //         data['transaction_time'] = date(this.config.item('dateformat').
    //             ' '.this.config.item('timeformat'));
    //         data['transaction_date'] = date(this.config.item('dateformat'));
    //         data['show_stock_locations'] = this.Stock_location.show_locations('sales');
    //         var customer_id;
    //         customer_id = salesControllerLib.get_customer();
    //         var employee_id;
    //         employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //         data['comments'] = salesControllerLib.get_comment();
    //         var emp_info;
    //         emp_info = this.Employee.get_info(employee_id);
    //         data['payments'] = salesControllerLib.get_payments();
    //         data['amount_change'] = salesControllerLib.get_amount_due() * -1;
    //         data['amount_due'] = salesControllerLib.get_amount_due();
    //         data['employee'] = emp_info.first_name.
    //         ' '.emp_info.last_name;
    //         //$data['cart']['employee'] = $data['employee'];
    //         data['company_info'] = implode('\n\
    // ', {
    //             0: this.config.item('address'),
    //             1: this.config.item('phone'),
    //             2: this.config.item('account_number')
    //         });
    //         data['company_address'] = this.config.item('address');
    //         data['company_phone'] = this.config.item('phone');
    //         data['company_account'] = this.config.item('account_number');
    //         data['company_name'] = this.config.item('company');
    //         var cust_info;
    //         cust_info = '';
    //         if (customer_id != -1) {
    //             cust_info = this.Customer.get_info(customer_id);
    //             if (isset(cust_info.company_name)) {
    //                 //$data['customer'] = $cust_info->company_name;
    //                 data['customer'] = cust_info.company_name.
    //                 ' '.cust_info.first_name.
    //                 ' '.cust_info.last_name;
    //             } else {
    //                 data['customer'] = cust_info.first_name.
    //                 ' '.cust_info.last_name;
    //             }
    //             data['customer_address'] = cust_info.address_1;
    //             data['customer_location'] = cust_info.zip.
    //             ' '.cust_info.city;
    //             data['account_number'] = cust_info.account_number;
    //             data['customer_info'] = implode('\n\
    // ', {
    //                 0: data['customer'],
    //                 1: data['customer_address'],
    //                 2: data['customer_location'],
    //                 3: data['account_number']
    //             });
    //         } else {
    //             data['customer'] = '';
    //         }
    //         var invoice_number;
    //         invoice_number = this._substitute_invoice_number(cust_info);
    //         if (salesControllerLib.is_invoice_number_enabled() && this.Sale.invoice_number_exists(invoice_number)) {
    //             data['error'] = this.lang.line('sales_invoice_number_duplicate');
    //             this._reload4RestApi(data);
    //         } else {
    //             invoice_number = salesControllerLib.is_invoice_number_enabled() ? invoice_number : NULL;
    //             data['invoice_number'] = invoice_number;
    //             var sale_id;
    //             sale_id = this.Sale.save(data['cart'], customer_id, employee_id, data['comments'], invoice_number, data['payments']);
    //             data['sale_id'] = 'POS '.sale_id;
    //             if (data['sale_id'] == 'POS -1') {
    //                 data['error_message'] = this.lang.line('sales_transaction_failed');
    //             } else {
    //                 data['barcode'] = this.barcode_lib.generate_receipt_barcode(data['sale_id']);
    //                 // if we want to email. .. just attach the pdf in there?
    //                 if (salesControllerLib.get_email_receipt() && !empty(cust_info.email)) {
    //                     this.load.library('email');
    //                     var config;
    //                     config['mailtype'] = 'html';
    //                     this.email.initialize(config);
    //                     this.email.from(this.config.item('email'), this.config.item('company'));
    //                     this.email.to(cust_info.email);
    //                     this.email.subject(this.lang.line('sales_receipt'));
    //                     if (this.config.item('use_invoice_template') && salesControllerLib.is_invoice_number_enabled()) {
    //                         data['image_prefix'] = '';
    //                         var filename;
    //                         filename = this._invoice_email_pdf(data);
    //                         this.email.attach(filename);
    //                         var text;
    //                         text = this.config.item('invoice_email_message');
    //                         text = str_replace('$INV', invoice_number, text);
    //                         text = str_replace('$CO', data['sale_id'], text);
    //                         text = this._substitute_customer(text, cust_info);
    //                         this.email.message(text);
    //                     } else {
    //                         this.email.message(this.load.view('sales/receipt_email', data, true));
    //                     }
    //                     this.email.send();
    //                 }
    //             }
    //             data['cur_giftcard_value'] = salesControllerLib.get_giftcard_remainder();
    //             data['print_after_sale'] = salesControllerLib.is_print_after_sale();
    //             if (data['print_after_sale']) {
    //                 //$this->printReceiptRestApi($data);//;_reload($data);
    //             }
    //             if (salesControllerLib.is_invoice_number_enabled() && this.config.item('use_invoice_template')) {
    //                 // $url = NodeServerUrl."?event=CompleteSale&id=".$sale_id."&appType=".APPTYPE."&data=".$data;
    //                 // $url = urlencode($url);
    //                 //  file_get_contents(urldecode($url));
    //                 var show_invoice;
    //                 show_invoice = true;
    //                 console.log(json_encode({
    //                     'data': data,
    //                     'invoice': show_invoice
    //                 }));
    //             } else {
    //                 //naming the result to "data" to keep it simple @new UI side, we can find out whether to use invoice template or not using invoice
    //                 //number
    //                 show_invoice = false;
    //                 console.log(json_encode({
    //                     'data': data,
    //                     'invoice': show_invoice
    //                 }));
    //                 //$this->printReceiptRestApi($data);
    //             }
    //             //SAI :: It comes here even if the transaction fails ($data['sale_id'] == 'POS -1').
    //             var url;
    //             url = NodeServerUrl.
    //             '?event=CompleteSale&id='.sale_id.
    //             '&appType='.APPTYPE;
    //             url = urlencode(url);
    //             file_get_contents(urldecode(url));
    //             salesControllerLib.clear_all();
    //         }
    //     }

    //     //not implemented phptojs\JsPrinter\JsPrinter::pStmt_Nop
    //     //not implemented phptojs\JsPrinter\JsPrinter::pStmt_Nop
    //     function completeTakeOrderRestApi() {
    //         var table_no, requestData;
    //         table_no = requestData['table_no'];
    //         var order_no;
    //         order_no = requestData['order_no'];
    //         var reservation_id;
    //         reservation_id = requestData['reservation_id'];
    //         var data;
    //         data['cart'] = salesControllerLib.get_cart();
    //         data['subtotal'] = salesControllerLib.get_subtotal();
    //         data['discounted_subtotal'] = salesControllerLib.get_subtotal(true);
    //         data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //         data['taxes'] = salesControllerLib.get_taxes();
    //         data['taxesData'] = this.getAllCartItemTaxes();
    //         data['total'] = salesControllerLib.get_total();
    //         data['discount'] = salesControllerLib.get_discount();
    //         data['receipt_title'] = this.lang.line('sales_receipt');
    //         data['transaction_time'] = date(this.config.item('dateformat').
    //             ' '.this.config.item('timeformat'));
    //         data['transaction_date'] = date(this.config.item('dateformat'));
    //         data['show_stock_locations'] = this.Stock_location.show_locations('sales');
    //         var customer_id;
    //         customer_id = salesControllerLib.get_customer();
    //         var employee_id;
    //         employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //         data['comments'] = salesControllerLib.get_comment();
    //         var emp_info;
    //         emp_info = this.Employee.get_info(employee_id);
    //         data['payments'] = salesControllerLib.get_payments();
    //         data['amount_change'] = salesControllerLib.get_amount_due() * -1;
    //         data['amount_due'] = salesControllerLib.get_amount_due();
    //         data['employee'] = emp_info.first_name.
    //         ' '.emp_info.last_name;
    //         data['company_info'] = implode('\n\
    // ', {
    //             0: this.config.item('address'),
    //             1: this.config.item('phone'),
    //             2: this.config.item('account_number')
    //         });
    //         data['company_address'] = this.config.item('address');
    //         data['company_phone'] = this.config.item('phone');
    //         data['company_account'] = this.config.item('account_number');
    //         data['company_name'] = this.config.item('company');
    //         var cust_info;
    //         cust_info = '';
    //         if (customer_id != -1) {
    //             cust_info = this.Customer.get_info(customer_id);
    //             if (isset(cust_info.company_name)) {
    //                 data['customer'] = cust_info.company_name;
    //             } else {
    //                 data['customer'] = cust_info.first_name.
    //                 ' '.cust_info.last_name;
    //             }
    //             data['customer_address'] = cust_info.address_1;
    //             data['customer_location'] = cust_info.zip.
    //             ' '.cust_info.city;
    //             data['account_number'] = cust_info.account_number;
    //             data['customer_info'] = implode('\n\
    // ', {
    //                 0: data['customer'],
    //                 1: data['customer_address'],
    //                 2: data['customer_location'],
    //                 3: data['account_number']
    //             });
    //         } else {
    //             data['customer'] = 'XXXXXXX';
    //         }
    //         var invoice_number;
    //         invoice_number = this._substitute_invoice_number(cust_info);
    //         if (salesControllerLib.is_invoice_number_enabled() && this.Sale.invoice_number_exists(invoice_number)) {
    //             data['error'] = this.lang.line('sales_invoice_number_duplicate');
    //             this._reload(data);
    //         } else {
    //             invoice_number = salesControllerLib.is_invoice_number_enabled() ? invoice_number : NULL;
    //             data['invoice_number'] = invoice_number;
    //             data['sale_id'] = 'POS '.this.Sale.save(data['cart'], customer_id, employee_id, data['comments'], invoice_number, data['payments']);
    //             if (data['sale_id'] == 'POS -1') {
    //                 data['error_message'] = this.lang.line('sales_transaction_failed');
    //             } else {
    //                 data['barcode'] = this.barcode_lib.generate_receipt_barcode(data['sale_id']);
    //                 // if we want to email. .. just attach the pdf in there?
    //                 if (salesControllerLib.get_email_receipt() && !empty(cust_info.email)) {
    //                     this.load.library('email');
    //                     var config;
    //                     config['mailtype'] = 'html';
    //                     this.email.initialize(config);
    //                     this.email.from(this.config.item('email'), this.config.item('company'));
    //                     this.email.to(cust_info.email);
    //                     this.email.subject(this.lang.line('sales_receipt'));
    //                     if (this.config.item('use_invoice_template') && salesControllerLib.is_invoice_number_enabled()) {
    //                         data['image_prefix'] = '';
    //                         var filename;
    //                         filename = this._invoice_email_pdf(data);
    //                         this.email.attach(filename);
    //                         var text;
    //                         text = this.config.item('invoice_email_message');
    //                         text = str_replace('$INV', invoice_number, text);
    //                         text = str_replace('$CO', data['sale_id'], text);
    //                         text = this._substitute_customer(text, cust_info);
    //                         this.email.message(text);
    //                     } else {
    //                         this.email.message(this.load.view('sales/receipt_email', data, true));
    //                     }
    //                     this.email.send();
    //                 }
    //             }
    //             data['cur_giftcard_value'] = salesControllerLib.get_giftcard_remainder();
    //             data['print_after_sale'] = salesControllerLib.is_print_after_sale();
    //             if (salesControllerLib.is_invoice_number_enabled() && this.config.item('use_invoice_template')) {
    //                 var show_invoice;
    //                 show_invoice = true;
    //                 console.log(json_encode({
    //                     'data': data,
    //                     'invoice': show_invoice
    //                 }));
    //             } else {
    //                 show_invoice = false;
    //                 // $this->printReceiptRestApi($data);
    //                 console.log(json_encode({
    //                     'data': data,
    //                     'invoice': show_invoice
    //                 }));
    //             }
    //             var saleIds4ThisTableOrder;
    //             saleIds4ThisTableOrder = this.Table.getSaleIds4ThisTablOrder(table_no, order_no);
    //             var _key_;
    //             for (_key_ in saleIds4ThisTableOrder.result()) {
    //                 var saleId;
    //                 saleId = saleIds4ThisTableOrder.result()[_key_];
    //                 this.Sale_suspended.delete4Restaurant(saleId.sale_id, order_no, table_no);
    //             }
    //             if (!reservation_id == 0) {
    //                 this.Reserve.deleteReservation(reservation_id);
    //             }
    //             salesControllerLib.clear_all();
    //         }
    //         var url;
    //         url = NodeServerUrl.
    //         '?event=updateTable&id='.table_no.
    //         '&appType='.APPTYPE;
    //         url = urlencode(url);
    //         file_get_contents(urldecode(url));
    //     }
    //     //function printReceiptRestApi($data){
    //     function completeDeliverySaleApiRestApi() {
    //         var data;
    //         data['cart'] = salesControllerLib.get_cart();
    //         data['subtotal'] = salesControllerLib.get_subtotal();
    //         data['discounted_subtotal'] = salesControllerLib.get_subtotal(true);
    //         data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //         data['taxes'] = salesControllerLib.get_taxes();
    //         data['total'] = salesControllerLib.get_total();
    //         data['discount'] = salesControllerLib.get_discount();
    //         data['receipt_title'] = this.lang.line('sales_receipt');
    //         data['transaction_time'] = date(this.config.item('dateformat').
    //             ' '.this.config.item('timeformat'));
    //         data['transaction_date'] = date(this.config.item('dateformat'));
    //         data['show_stock_locations'] = this.Stock_location.show_locations('sales');
    //         var customer_id;
    //         customer_id = salesControllerLib.get_customer();
    //         var employee_id;
    //         employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //         data['comments'] = salesControllerLib.get_comment();
    //         var emp_info;
    //         emp_info = this.Employee.get_info(employee_id);
    //         data['payments'] = salesControllerLib.get_payments();
    //         data['amount_change'] = salesControllerLib.get_amount_due() * -1;
    //         data['amount_due'] = salesControllerLib.get_amount_due();
    //         data['employee'] = emp_info.first_name.
    //         ' '.emp_info.last_name;
    //         data['company_info'] = implode('\n\
    // ', {
    //             0: this.config.item('address'),
    //             1: this.config.item('phone'),
    //             2: this.config.item('account_number')
    //         });
    //         data['company_address'] = this.config.item('address');
    //         data['company_phone'] = this.config.item('phone');
    //         data['company_account'] = this.config.item('account_number');
    //         data['company_name'] = this.config.item('company');
    //         var cust_info;
    //         cust_info = '';
    //         if (customer_id != -1) {
    //             cust_info = this.Customer.get_info(customer_id);
    //             if (isset(cust_info.company_name)) {
    //                 data['customer'] = cust_info.company_name;
    //             } else {
    //                 data['customer'] = cust_info.first_name.
    //                 ' '.cust_info.last_name;
    //             }
    //             data['customer_address'] = cust_info.address_1;
    //             data['customer_location'] = cust_info.zip.
    //             ' '.cust_info.city;
    //             data['account_number'] = cust_info.account_number;
    //             data['customer_info'] = implode('\n\
    // ', {
    //                 0: data['customer'],
    //                 1: data['customer_address'],
    //                 2: data['customer_location'],
    //                 3: data['account_number']
    //             });
    //         } else {
    //             data['customer'] = 'XXXXXXX';
    //         }
    //         var invoice_number;
    //         invoice_number = this._substitute_invoice_number(cust_info);
    //         if (salesControllerLib.is_invoice_number_enabled() && this.Sale.invoice_number_exists(invoice_number)) {
    //             data['error'] = this.lang.line('sales_invoice_number_duplicate');
    //             this._reload(data);
    //         } else {
    //             invoice_number = salesControllerLib.is_invoice_number_enabled() ? invoice_number : NULL;
    //             data['invoice_number'] = invoice_number;
    //             var sale_id;
    //             sale_id = this.Sale.save(data['cart'], customer_id, employee_id, data['comments'], invoice_number, data['payments']);
    //             data['sale_id'] = 'POS '.sale_id;
    //             if (data['sale_id'] == 'POS -1') {
    //                 data['error_message'] = this.lang.line('sales_transaction_failed');
    //             } else {
    //                 data['barcode'] = this.barcode_lib.generate_receipt_barcode(data['sale_id']);
    //                 // if we want to email. .. just attach the pdf in there?
    //                 if (salesControllerLib.get_email_receipt() && !empty(cust_info.email)) {
    //                     this.load.library('email');
    //                     var config;
    //                     config['mailtype'] = 'html';
    //                     this.email.initialize(config);
    //                     this.email.from(this.config.item('email'), this.config.item('company'));
    //                     this.email.to(cust_info.email);
    //                     this.email.subject(this.lang.line('sales_receipt'));
    //                     if (this.config.item('use_invoice_template') && salesControllerLib.is_invoice_number_enabled()) {
    //                         data['image_prefix'] = '';
    //                         var filename;
    //                         filename = this._invoice_email_pdf(data);
    //                         this.email.attach(filename);
    //                         var text;
    //                         text = this.config.item('invoice_email_message');
    //                         text = str_replace('$INV', invoice_number, text);
    //                         text = str_replace('$CO', data['sale_id'], text);
    //                         text = this._substitute_customer(text, cust_info);
    //                         this.email.message(text);
    //                     } else {
    //                         this.email.message(this.load.view('sales/receipt_email', data, true));
    //                     }
    //                     this.email.send();
    //                 }
    //                 var url;
    //                 url = NodeServerUrl.
    //                 '?event=CompleteSale&id='.sale_id.
    //                 '&appType='.APPTYPE;
    //                 url = urlencode(url);
    //                 file_get_contents(urldecode(url));
    //             }
    //             data['cur_giftcard_value'] = salesControllerLib.get_giftcard_remainder();
    //             data['print_after_sale'] = salesControllerLib.is_print_after_sale();
    //             if (data['print_after_sale']) {
    //                 //$this->load->view("sales/print_receipt",$data);
    //                 this.printReceiptRestApi(data);
    //             }
    //             if (salesControllerLib.is_invoice_number_enabled() && this.config.item('use_invoice_template')) {
    //                 //naming the result to "data" to keep it simple @new UI side, we can find out whether to use invoice template or not using invoice
    //                 //number
    //                 var show_invoice;
    //                 show_invoice = true;
    //                 console.log(json_encode({
    //                     'data': data,
    //                     'invoice': show_invoice
    //                 }));
    //             } else {
    //                 //naming the result to "data" to keep it simple @new UI side, we can find out whether to use invoice template or not using invoice
    //                 //number
    //                 show_invoice = false;
    //                 console.log(json_encode({
    //                     'data': data,
    //                     'invoice': show_invoice
    //                 }));
    //             }
    //             salesControllerLib.clear_all();
    //             var homeDeliveryData;
    //             homeDeliveryData = this.Delivery.gethomedeliveryBySalesId(requestData['sale_id']).result();
    //             var delivery_id;
    //             delivery_id = homeDeliveryData[0].delivery_id;
    //             url = NodeServerUrl.
    //             '?event=deleteHomeDelivery&id='.delivery_id.
    //             '&appType='.APPTYPE;
    //             url = urlencode(url);
    //             file_get_contents(urldecode(url));
    //         }
    //         var deliverysale_id;
    //         deliverysale_id = requestData['sale_id'];
    //         this.Sale_suspended.delete4Delivery(deliverysale_id);
    //     }

    //     function completeSale4TwoTerminalRestApi() {
    //         var data;
    //         data['cart'] = salesControllerLib.get_cart();
    //         data['subtotal'] = salesControllerLib.get_subtotal();
    //         data['discounted_subtotal'] = salesControllerLib.get_subtotal(true);
    //         data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //         data['taxes'] = salesControllerLib.get_taxes();
    //         data['total'] = salesControllerLib.get_total();
    //         data['discount'] = salesControllerLib.get_discount();
    //         data['receipt_title'] = this.lang.line('sales_receipt');
    //         data['transaction_time'] = date(this.config.item('dateformat').
    //             ' '.this.config.item('timeformat'));
    //         data['transaction_date'] = date(this.config.item('dateformat'));
    //         data['show_stock_locations'] = this.Stock_location.show_locations('sales');
    //         var customer_id;
    //         customer_id = salesControllerLib.get_customer();
    //         var employee_id;
    //         employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //         data['comments'] = salesControllerLib.get_comment();
    //         var emp_info;
    //         emp_info = this.Employee.get_info(employee_id);
    //         data['payments'] = salesControllerLib.get_payments();
    //         data['amount_change'] = salesControllerLib.get_amount_due() * -1;
    //         data['amount_due'] = salesControllerLib.get_amount_due();
    //         data['employee'] = emp_info.first_name.
    //         ' '.emp_info.last_name;
    //         data['company_info'] = implode('\n\
    // ', {
    //             0: this.config.item('address'),
    //             1: this.config.item('phone'),
    //             2: this.config.item('account_number')
    //         });
    //         data['company_address'] = this.config.item('address');
    //         data['company_phone'] = this.config.item('phone');
    //         data['company_account'] = this.config.item('account_number');
    //         data['company_name'] = this.config.item('company');
    //         var cust_info;
    //         cust_info = '';
    //         if (customer_id != -1) {
    //             cust_info = this.Customer.get_info(customer_id);
    //             if (isset(cust_info.company_name)) {
    //                 data['customer'] = cust_info.company_name;
    //             } else {
    //                 data['customer'] = cust_info.first_name.
    //                 ' '.cust_info.last_name;
    //             }
    //             data['customer_address'] = cust_info.address_1;
    //             data['customer_location'] = cust_info.zip.
    //             ' '.cust_info.city;
    //             data['account_number'] = cust_info.account_number;
    //             data['customer_info'] = implode('\n\
    // ', {
    //                 0: data['customer'],
    //                 1: data['customer_address'],
    //                 2: data['customer_location'],
    //                 3: data['account_number']
    //             });
    //         } else {
    //             data['customer'] = 'XXXXXXX';
    //         }
    //         var invoice_number;
    //         invoice_number = this._substitute_invoice_number(cust_info);
    //         if (salesControllerLib.is_invoice_number_enabled() && this.Sale.invoice_number_exists(invoice_number)) {
    //             data['error'] = this.lang.line('sales_invoice_number_duplicate');
    //             this._reload(data);
    //         } else {
    //             invoice_number = salesControllerLib.is_invoice_number_enabled() ? invoice_number : NULL;
    //             data['invoice_number'] = invoice_number;
    //             data['sale_id'] = 'POS '.this.Sale.save(data['cart'], customer_id, employee_id, data['comments'], invoice_number, data['payments']);
    //             if (data['sale_id'] == 'POS -1') {
    //                 data['error_message'] = this.lang.line('sales_transaction_failed');
    //             } else {
    //                 data['barcode'] = this.barcode_lib.generate_receipt_barcode(data['sale_id']);
    //                 // if we want to email. .. just attach the pdf in there?
    //                 if (salesControllerLib.get_email_receipt() && !empty(cust_info.email)) {
    //                     this.load.library('email');
    //                     var config;
    //                     config['mailtype'] = 'html';
    //                     this.email.initialize(config);
    //                     this.email.from(this.config.item('email'), this.config.item('company'));
    //                     this.email.to(cust_info.email);
    //                     this.email.subject(this.lang.line('sales_receipt'));
    //                     if (this.config.item('use_invoice_template') && salesControllerLib.is_invoice_number_enabled()) {
    //                         data['image_prefix'] = '';
    //                         var filename;
    //                         filename = this._invoice_email_pdf(data);
    //                         this.email.attach(filename);
    //                         var text;
    //                         text = this.config.item('invoice_email_message');
    //                         text = str_replace('$INV', invoice_number, text);
    //                         text = str_replace('$CO', data['sale_id'], text);
    //                         text = this._substitute_customer(text, cust_info);
    //                         this.email.message(text);
    //                     } else {
    //                         this.email.message(this.load.view('sales/receipt_email', data, true));
    //                     }
    //                     this.email.send();
    //                 }
    //             }
    //             data['cur_giftcard_value'] = salesControllerLib.get_giftcard_remainder();
    //             data['print_after_sale'] = salesControllerLib.is_print_after_sale();
    //             if (data['print_after_sale']) {
    //                 //$this->load->view("sales/print_receipt",$data);
    //                 this.printReceiptRestApi(data);
    //             }
    //             if (salesControllerLib.is_invoice_number_enabled() && this.config.item('use_invoice_template')) {
    //                 //naming the result to "data" to keep it simple @new UI side, we can find out whether to use invoice template or not using invoice
    //                 //number
    //                 var show_invoice;
    //                 show_invoice = true;
    //                 console.log(json_encode({
    //                     'data': data,
    //                     'invoice': show_invoice
    //                 }));
    //             } else {
    //                 //naming the result to "data" to keep it simple @new UI side, we can find out whether to use invoice template or not using invoice
    //                 //number
    //                 show_invoice = false;
    //                 console.log(json_encode({
    //                     'data': data,
    //                     'invoice': show_invoice
    //                 }));
    //             }
    //             salesControllerLib.clear_all();
    //             // $oldcwd = getcwd();
    //             //  //chdir($oldcwd+"/sendEvents2NodeServer");
    //             // shell_exec($oldcwd.'/sendEvents2NodeServer/sendEvent2NodeServer.js sale '.$oldcwd. "> /dev/null 2>/dev/null &" );
    //             //      //chdir($oldcwd);
    //         }
    //         var Ordersale_id, requestData;
    //         Ordersale_id = requestData['sale_id'];
    //         var orderDataForMultipleTerminal;
    //         orderDataForMultipleTerminal = this.TwoterminalPaymentModel.getOrderIdForMultipleTerminal(Ordersale_id).result();
    //         var url;
    //         url = NodeServerUrl.
    //         '?event=deleteOrderForCounter&id='.orderDataForMultipleTerminal[0].order_id.
    //         '&appType='.APPTYPE;
    //         url = urlencode(url);
    //         file_get_contents(urldecode(url));
    //         this.Sale_suspended.deleteOrder4TwoTerminal(Ordersale_id);
    //         //$this->_remove_duplicate_cookies();
    //     }

    //     //not implemented phptojs\JsPrinter\JsPrinter::pStmt_Nop
    //     function getItemsRestApi(limit_from) {
    //         if (typeof limit_from == 'undefined') limit_from = 0;
    //         var stock_location;
    //         stock_location = 1;
    //         var stock_locations;
    //         stock_locations = this.Stock_location.get_allowed_locations();
    //         var lines_per_page;
    //         lines_per_page = this.Appconfig.get('lines_per_page');
    //         var items;
    //         items = this.Item.get_all(stock_location, lines_per_page, limit_from);
    //         //new
    //         var data;
    //         data['stock_location'] = stock_location;
    //         data['stock_locations'] = stock_locations;
    //         var _key_;
    //         for (_key_ in items.result()) {
    //             var item;
    //             item = items.result()[_key_];
    //             var ItemsJson;
    //             ItemsJson[] = item;
    //         }
    //         console.log(json_encode({
    //             'items': ItemsJson
    //         }));
    //     }

    //     function complete() {
    //         var data;
    //         data['cart'] = salesControllerLib.get_cart();
    //         data['subtotal'] = salesControllerLib.get_subtotal();
    //         data['discounted_subtotal'] = salesControllerLib.get_subtotal(true);
    //         data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //         data['taxes'] = salesControllerLib.get_taxes();
    //         data['total'] = salesControllerLib.get_total();
    //         data['discount'] = salesControllerLib.get_discount();
    //         data['receipt_title'] = this.lang.line('sales_receipt');
    //         data['transaction_time'] = date(this.config.item('dateformat').
    //             ' '.this.config.item('timeformat'));
    //         data['transaction_date'] = date(this.config.item('dateformat'));
    //         data['show_stock_locations'] = this.Stock_location.show_locations('sales');
    //         var customer_id;
    //         customer_id = salesControllerLib.get_customer();
    //         var employee_id;
    //         employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //         data['comments'] = salesControllerLib.get_comment();
    //         var emp_info;
    //         emp_info = this.Employee.get_info(employee_id);
    //         data['payments'] = salesControllerLib.get_payments();
    //         data['amount_change'] = salesControllerLib.get_amount_due() * -1;
    //         data['amount_due'] = salesControllerLib.get_amount_due();
    //         data['employee'] = emp_info.first_name.
    //         ' '.emp_info.last_name;
    //         data['company_info'] = implode('\n\
    // ', {
    //             0: this.config.item('address'),
    //             1: this.config.item('phone'),
    //             2: this.config.item('account_number')
    //         });
    //         var cust_info;
    //         cust_info = '';
    //         if (customer_id != -1) {
    //             cust_info = this.Customer.get_info(customer_id);
    //             if (isset(cust_info.company_name)) {
    //                 data['customer'] = cust_info.company_name;
    //             } else {
    //                 data['customer'] = cust_info.first_name.
    //                 ' '.cust_info.last_name;
    //             }
    //             data['customer_address'] = cust_info.address_1;
    //             data['customer_location'] = cust_info.zip.
    //             ' '.cust_info.city;
    //             data['account_number'] = cust_info.account_number;
    //             data['customer_info'] = implode('\n\
    // ', {
    //                 0: data['customer'],
    //                 1: data['customer_address'],
    //                 2: data['customer_location'],
    //                 3: data['account_number']
    //             });
    //         }
    //         var invoice_number;
    //         invoice_number = this._substitute_invoice_number(cust_info);
    //         if (salesControllerLib.is_invoice_number_enabled() && this.Sale.invoice_number_exists(invoice_number)) {
    //             data['error'] = this.lang.line('sales_invoice_number_duplicate');
    //             this._reload(data);
    //         } else {
    //             invoice_number = salesControllerLib.is_invoice_number_enabled() ? invoice_number : null;
    //             data['invoice_number'] = invoice_number;
    //             data['sale_id'] = 'POS '.this.Sale.save(data['cart'], customer_id, employee_id, data['comments'], invoice_number, data['payments']);
    //             if (data['sale_id'] == 'POS -1') {
    //                 data['error_message'] = this.lang.line('sales_transaction_failed');
    //             } else {
    //                 data['barcode'] = this.barcode_lib.generate_receipt_barcode(data['sale_id']);
    //                 // if we want to email. .. just attach the pdf in there?
    //                 if (salesControllerLib.get_email_receipt() && !empty(cust_info.email)) {
    //                     this.load.library('email');
    //                     var config;
    //                     config['mailtype'] = 'html';
    //                     this.email.initialize(config);
    //                     this.email.from(this.config.item('email'), this.config.item('company'));
    //                     this.email.to(cust_info.email);
    //                     this.email.subject(this.lang.line('sales_receipt'));
    //                     if (this.config.item('use_invoice_template') && salesControllerLib.is_invoice_number_enabled()) {
    //                         data['image_prefix'] = '';
    //                         var filename;
    //                         filename = this._invoice_email_pdf(data);
    //                         this.email.attach(filename);
    //                         var text;
    //                         text = this.config.item('invoice_email_message');
    //                         text = str_replace('$INV', invoice_number, text);
    //                         text = str_replace('$CO', data['sale_id'], text);
    //                         text = this._substitute_customer(text, cust_info);
    //                         this.email.message(text);
    //                     } else {
    //                         this.email.message(this.load.view('sales/receipt_email', data, true));
    //                     }
    //                     this.email.send();
    //                 }
    //             }
    //             data['cur_giftcard_value'] = salesControllerLib.get_giftcard_remainder();
    //             data['print_after_sale'] = salesControllerLib.is_print_after_sale();
    //             if (salesControllerLib.is_invoice_number_enabled() && this.config.item('use_invoice_template')) {
    //                 this.load.view('sales/invoice', data);
    //             } else {
    //                 this.load.view('sales/receipt', data);
    //             }
    //             salesControllerLib.clear_all();
    //             var oldcwd;
    //             oldcwd = getcwd();
    //             //chdir($oldcwd+"/sendEvents2NodeServer");
    //             shell_exec(oldcwd.
    //                 '/sendEvents2NodeServer/sendEvent2NodeServer.js sale '.oldcwd.
    //                 '> /dev/null 2>/dev/null &');
    //             //chdir($oldcwd);
    //         }
    //     }

    //     // function _invoice_email_pdf($data)
    //     //function invoice_email($sale_id)
    //     //function send_invoice($sale_id)
    //     function _substitute_variable(text, variable, object, function) {
    //         // don't query if this variable isn't used
    //         if (strstr(text, variable)) {
    //             var value;
    //             value = callUserFunc({
    //                 0: object,
    //                 1: function
    //             });
    //             text = str_replace(variable, value, text);
    //         }
    //         return text;
    //     }

    //     function _substitute_customer(text, cust_info) {
    //         // substitute customer info
    //         var customer_id;
    //         customer_id = salesControllerLib.get_customer();
    //         if (customer_id != -1 && cust_info != '') {
    //             text = str_replace('$CU', cust_info.first_name.
    //                 ' '.cust_info.last_name, text);
    //             var words;
    //             words = preg_split('/\\s+/', trim(cust_info.first_name.
    //                 ' '.cust_info.last_name));
    //             var acronym;
    //             acronym = '';
    //             var _key_;
    //             for (_key_ in words) {
    //                 var w;
    //                 w = words[_key_];
    //                 acronym += w[0];
    //             }
    //             text = str_replace('$CI', acronym, text);
    //         }
    //         return text;
    //     }

    //     function _substitute_variables(text, cust_info) {
    //         text = this._substitute_variable(text, '$YCO', this.Sale, 'get_invoice_number_for_year');
    //         text = this._substitute_variable(text, '$CO', this.Sale, 'get_invoice_count');
    //         text = this._substitute_variable(text, '$SCO', this.Sale_suspended, 'get_invoice_count');
    //         text = strftime(text);
    //         text = this._substitute_customer(text, cust_info);
    //         return text;
    //     }

    //     function _substitute_invoice_number(cust_info) {
    //         var invoice_number;
    //         invoice_number = this.config.config['sales_invoice_format'];
    //         invoice_number = this._substitute_variables(invoice_number, cust_info);
    //         salesControllerLib.set_invoice_number(invoice_number, true);
    //         return salesControllerLib.get_invoice_number();
    //     }

    //     function _load_sale_data(sale_id) {
    //         this.Sale.create_sales_items_temp_table();
    //         salesControllerLib.clear_all();
    //         var sale_info;
    //         sale_info = this.Sale.get_info(sale_id).row_array();
    //         salesControllerLib.copy_entire_sale(sale_id);
    //         var data;
    //         data['cart'] = salesControllerLib.get_cart();
    //         data['payments'] = salesControllerLib.get_payments();
    //         data['subtotal'] = salesControllerLib.get_subtotal();
    //         data['discounted_subtotal'] = salesControllerLib.get_subtotal(true);
    //         data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //         data['taxes'] = salesControllerLib.get_taxes();
    //         data['total'] = salesControllerLib.get_total();
    //         data['discount'] = salesControllerLib.get_discount();
    //         data['receipt_title'] = this.lang.line('sales_receipt');
    //         data['transaction_time'] = date(this.config.item('dateformat').
    //             ' '.this.config.item('timeformat'), strtotime(sale_info['sale_time']));
    //         data['transaction_date'] = date(this.config.item('dateformat'), strtotime(sale_info['sale_time']));
    //         data['show_stock_locations'] = this.Stock_location.show_locations('sales');
    //         var customer_id;
    //         customer_id = salesControllerLib.get_customer();
    //         var employee_id;
    //         employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //         var emp_info;
    //         emp_info = this.Employee.get_info(employee_id);
    //         data['amount_change'] = salesControllerLib.get_amount_due() * -1;
    //         data['amount_due'] = salesControllerLib.get_amount_due();
    //         data['employee'] = emp_info.first_name.
    //         ' '.emp_info.last_name;
    //         if (customer_id != -1) {
    //             var cust_info;
    //             cust_info = this.Customer.get_info(customer_id);
    //             if (isset(cust_info.company_name)) {
    //                 data['customer'] = cust_info.company_name;
    //             } else {
    //                 data['customer'] = cust_info.first_name.
    //                 ' '.cust_info.last_name;
    //             }
    //             data['first_name'] = cust_info.first_name;
    //             data['last_name'] = cust_info.last_name;
    //             data['customer_address'] = cust_info.address_1;
    //             data['customer_location'] = cust_info.zip.
    //             ' '.cust_info.city;
    //             data['customer_email'] = cust_info.email;
    //             data['account_number'] = cust_info.account_number;
    //             data['customer_info'] = implode('\n\
    // ', {
    //                 0: data['customer'],
    //                 1: data['customer_address'],
    //                 2: data['customer_location'],
    //                 3: data['account_number']
    //             });
    //         }
    //         data['sale_id'] = 'POS '.sale_id;
    //         data['comments'] = sale_info['comment'];
    //         data['invoice_number'] = sale_info['invoice_number'];
    //         data['company_info'] = implode('\n\
    // ', {
    //             0: this.config.item('address'),
    //             1: this.config.item('phone'),
    //             2: this.config.item('account_number')
    //         });
    //         data['barcode'] = this.barcode_lib.generate_receipt_barcode(data['sale_id']);
    //         data['print_after_sale'] = false;
    //         return data;
    //     }

    //     function receipt(sale_id) {
    //         var data;
    //         data = this._load_sale_data(sale_id);
    //         this.load.view('sales/receipt', data);
    //         salesControllerLib.clear_all();
    //     }

    //     function receiptRestApi() {
    //         var sale_id, requestData;
    //         sale_id = requestData['saleid'];
    //         var data;
    //         data = this._load_sale_data(sale_id);
    //         //$this->load->view("sales/receipt",$data);
    //         //$this->printReceiptRestApi($data);
    //         console.log(json_encode({
    //             'data': data
    //         }));
    //         salesControllerLib.clear_all();
    //     }

    //     Convert

    //     Execute
    //     Converted JavaScript code

    //     //printReceiptRestApi
    //     //function printReceiptApi()
    //     //function invoice($sale_id, $sale_info='')
    //     //function invoiceRestApi()
    //     function edit(sale_id) {
    //         var data;
    //         data = {};
    //         data['employees'] = {};
    //         var _key_;
    //         for (_key_ in this.Employee.get_all().result()) {
    //             var employee;
    //             employee = this.Employee.get_all().result()[_key_];
    //             data['employees'][employee.person_id] = employee.first_name.
    //             ' '.employee.last_name;
    //         }
    //         this.Sale.create_sales_items_temp_table();
    //         var sale_info;
    //         sale_info = this.Sale.get_info(sale_id).row_array();
    //         var person_name;
    //         person_name = sale_info['first_name'].
    //         ' '.sale_info['last_name'];
    //         data['selected_customer'] = !empty(sale_info['customer_id']) ? sale_info['customer_id'].
    //         '|'.person_name: '';
    //         data['sale_info'] = sale_info;
    //         this.load.view('sales/form', data);
    //     }

    //     function delete(sale_id, update_inventory) {
    //         if (typeof sale_id == 'undefined') sale_id = -1;
    //         if (typeof update_inventory == 'undefined') update_inventory = true;
    //         var employee_id;
    //         employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //         var sale_ids;
    //         sale_ids = sale_id == -1 ? this.input.post('ids') : {
    //             0: sale_id
    //         };
    //         if (this.Sale.delete_list(sale_ids, employee_id, update_inventory)) {
    //             console.log(json_encode({
    //                 'success': true,
    //                 'message': this.lang.line('sales_successfully_deleted').
    //                 ' '.count(sale_ids).
    //                 ' '.this.lang.line('sales_one_or_multiple'),
    //                 'ids': sale_ids
    //             }));
    //         } else {
    //             console.log(json_encode({
    //                 'success': false,
    //                 'message': this.lang.line('sales_unsuccessfully_deleted')
    //             }));
    //         }
    //     }
    //     //delete_listRestApi
    //     function deleteWholeSaleRestApi() {
    //         //$sale_id = -1;
    //         var update_inventory;
    //         update_inventory = true;
    //         var employee_id;
    //         employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //         //$sale_ids= $sale_id == -1 ? $requestData['sale_id'] : array($sale_id);
    //         //$sale_ids= $requestData['sale_id'];
    //         if (this.Sale.delete_listRestApi(employee_id, update_inventory)) {
    //             console.log(json_encode({
    //                 'success': true,
    //                 'message': this.lang.line('sales_successfully_deleted').
    //                 ' '.this.lang.line('sales_one_or_multiple')
    //             }));
    //         } else {
    //             console.log(json_encode({
    //                 'success': false,
    //                 'message': this.lang.line('sales_unsuccessfully_deleted')
    //             }));
    //         }
    //     }

    //     function deleteSaleRestApi() {
    //         //$sale_id = -1;
    //         $update_inventory = TRUE;
    //         $employee_id = $this - > Employee - > get_logged_in_employee_info() - > person_id;
    //         //$sale_ids= $sale_id == -1 ? $requestData['sale_id'] : array($sale_id);
    //         $sale_ids = $requestData['sale_id'];

    //         if ($this - > Sale - > delete($sale_ids, $employee_id, $update_inventory)) {
    //             $url = NodeServerUrl.
    //             "?event=DeleteSale&id=".$sale_ids.
    //             "&appType=".APPTYPE;
    //             $url = urlencode($url);
    //             file_get_contents(urldecode($url));

    //             echo json_encode(array('success' => true, 'message' => $this - > lang - > line('sales_successfully_deleted').
    //                 ' '.count($sale_ids).
    //                 ' '.$this - > lang - > line('sales_one_or_multiple'), 'ids' => $sale_ids));
    //         } else {
    //             echo json_encode(array('success' => false, 'message' => $this - > lang - > line('sales_unsuccessfully_deleted')));
    //         }
    //     }

    //     //saveEditSalesRestApi
    //     function saveEditSalesRestApi() {
    //         $_POST = $requestData;
    //         $sale_id = $requestData['sale_id'];
    //         $date = date_create($requestData['sale_date']);
    //         $requestData['sale_date'] = date_format($date, "d/m/Y H:i:s");
    //         //$requestData['sale_date']= '05/03/2016 10:35:20';
    //         $start_date_formatter = $date; //$requestData['sale_date'];// date_create_from_format($this->config->item('dateformat') . ' ' . $this->config->item('timeformat'), $requestData['sale_date']);

    //         $sale_data = array(
    //             'sale_time' => $start_date_formatter - > format('Y-m-d H:i:s'),
    //             'customer_id' => $requestData['customer_id'] != '' ? $requestData['customer_id'] : null,
    //             'employee_id' => $requestData['employee_id'],
    //             'comment' => $requestData['comment'],
    //             'invoice_number' => $requestData['invoice_number'] != '' ? $requestData['invoice_number'] : null
    //         );

    //         if ($this - > Sale - > update($sale_data, $sale_id)) {
    //             $url = NodeServerUrl.
    //             "?event=EditSale&id=".$sale_id.
    //             "&appType=".APPTYPE;
    //             $url = urlencode($url);
    //             file_get_contents(urldecode($url));

    //             echo json_encode(array(
    //                 'success' => true,
    //                 'message' => $this - > lang - > line('sales_successfully_updated'),
    //                 'id' => $sale_id));
    //         } else {
    //             echo json_encode(array(
    //                 'success' => false,
    //                 'message' => $this - > lang - > line('sales_unsuccessfully_updated'),
    //                 'id' => $sale_id));
    //         }
    //     }

    //     //saveEditSalesRestApi
    //     function saveEditSalesRestApi() {
    //         var sale_id, requestData;
    //         sale_id = requestData['sale_id'];
    //         var date;
    //         date = date_create(requestData['sale_date']);
    //         requestData['sale_date'] = date_format(date, 'd/m/Y H:i:s');
    //         //$requestData['sale_date']= '05/03/2016 10:35:20';
    //         var start_date_formatter;
    //         start_date_formatter = date;
    //         //$requestData['sale_date'];// date_create_from_format($this->config->item('dateformat') . ' ' . $this->config->item('timeformat'), $requestData['sale_date']);
    //         var sale_data;
    //         sale_data = {
    //             'sale_time': start_date_formatter.format('Y-m-d H:i:s'),
    //             'customer_id': requestData['customer_id'] != '' ? requestData['customer_id'] : null,
    //             'employee_id': requestData['employee_id'],
    //             'comment': requestData['comment'],
    //             'invoice_number': requestData['invoice_number'] != '' ? requestData['invoice_number'] : null
    //         };
    //         if (this.Sale.update(sale_data, sale_id)) {
    //             var url;
    //             url = NodeServerUrl.
    //             '?event=EditSale&id='.sale_id.
    //             '&appType='.APPTYPE;
    //             url = urlencode(url);
    //             file_get_contents(urldecode(url));
    //             console.log(json_encode({
    //                 'success': true,
    //                 'message': this.lang.line('sales_successfully_updated'),
    //                 'id': sale_id
    //             }));
    //         } else {
    //             console.log(json_encode({
    //                 'success': false,
    //                 'message': this.lang.line('sales_unsuccessfully_updated'),
    //                 'id': sale_id
    //             }));
    //         }
    //     }

    //     function save(sale_id) {
    //         var start_date_formatter;
    //         start_date_formatter = date_create_from_format(this.config.item('dateformat').
    //             ' '.this.config.item('timeformat'), this.input.post('date'));
    //         var sale_data;
    //         sale_data = {
    //             'sale_time': start_date_formatter.format('Y-m-d H:i:s'),
    //             'customer_id': this.input.post('customer_id') != '' ? this.input.post('customer_id') : null,
    //             'employee_id': this.input.post('employee_id'),
    //             'comment': this.input.post('comment'),
    //             'invoice_number': this.input.post('invoice_number') != '' ? this.input.post('invoice_number') : null
    //         };
    //         if (this.Sale.update(sale_data, sale_id)) {
    //             console.log(json_encode({
    //                 'success': true,
    //                 'message': this.lang.line('sales_successfully_updated'),
    //                 'id': sale_id
    //             }));
    //         } else {
    //             console.log(json_encode({
    //                 'success': false,
    //                 'message': this.lang.line('sales_unsuccessfully_updated'),
    //                 'id': sale_id
    //             }));
    //         }
    //     }

    //     function _payments_cover_total() {
    //         var total_payments;
    //         total_payments = 0;
    //         var _key_;
    //         for (_key_ in salesControllerLib.get_payments()) {
    //             var payment;
    //             payment = salesControllerLib.get_payments()[_key_];
    //             total_payments += payment['payment_amount'];
    //         }
    //         /* Changed the conditional to account for floating point rounding 
    //     if (salesControllerLib.get_mode() == 'sale' && to_currency_no_money(salesControllerLib.get_total()) - total_payments > 1.0E-6) {
    //         return false;
    //     }
    //     return true;
    // }

    // function getCartTaxes() {
    //     var taxArray;
    //     taxArray = {};
    //     var line;
    //     for (line in salesControllerLib.get_cart()) {
    //         var item;
    //         item = salesControllerLib.get_cart()[line];
    //         //array_push($data, $this->sale_lib->CI->Item_taxes->get_info($item['item_id']));
    //         var data;
    //         data = salesControllerLib.CI.Item_taxes.get_info(item['item_id']);
    //         var _key_;
    //         for (_key_ in data) {
    //             var tax;
    //             tax = data[_key_];
    //             var taxAmt;
    //             taxAmt = {};
    //             var tax_percentage;
    //             tax_percentage = tax['percent'];
    //             //array_push($taxAmt,$this->sale_lib->get_item_tax($item['quantity'], $item['price'], $item['discount'], $tax_percentage));
    //             taxAmt['item_id'] = item['item_id'];
    //             taxAmt['percent'] = tax_percentage;
    //             taxAmt['Amt'] = salesControllerLib.get_item_tax(item['quantity'], item['price'], item['discount'], tax_percentage);
    //             taxAmt['name'] = tax['name'];
    //             array_push(taxArray, taxAmt);
    //             //$taxAmt[$item['item_id']] =$this->sale_lib->get_item_tax($item['quantity'], $item['price'], $item['discount'], $tax_percentage);
    //         }
    //         //array_push($allTaxes, $taxArray);
    //         //}
    //     }
    //     console.log(json_encode({
    //         'taxAmount': taxArray
    //     }));
    //     //return $taxArray;
    // }

    // function getAllCartItemTaxes() {
    //     var taxArray;
    //     taxArray = {};
    //     var line;
    //     for (line in salesControllerLib.get_cart()) {
    //         var item;
    //         item = salesControllerLib.get_cart()[line];
    //         //array_push($data, $this->sale_lib->CI->Item_taxes->get_info($item['item_id']));
    //         var data;
    //         data = salesControllerLib.CI.Item_taxes.get_info(item['item_id']);

    //         var _key_;
    //         for (_key_ in data) {
    //             var tax;
    //             tax = data[_key_];
    //             var taxAmt;
    //             taxAmt = {};
    //             var tax_percentage;
    //             tax_percentage = tax['percent'];
    //             //array_push($taxAmt,$this->sale_lib->get_item_tax($item['quantity'], $item['price'], $item['discount'], $tax_percentage));
    //             taxAmt['item_id'] = item['item_id'];
    //             taxAmt['percent'] = tax_percentage;
    //             taxAmt['Amt'] = salesControllerLib.get_item_tax(item['quantity'], item['price'], item['discount'], tax_percentage);
    //             taxAmt['name'] = tax['name'];
    //             array_push(taxArray, taxAmt);
    //             //$taxAmt[$item['item_id']] =$this->sale_lib->get_item_tax($item['quantity'], $item['price'], $item['discount'], $tax_percentage);
    //         }
    //         //array_push($allTaxes, $taxArray);
    //         //}
    //     }
    //     //  echo json_encode(array("taxAmount"=>$taxArray));
    //     return taxArray;
    // }

    // function _reload4Homedelivery(data, customer_id) {
    //     if (typeof data == 'undefined') data = {};
    //     var person_info;
    //     person_info = this.Employee.get_logged_in_employee_info();
    //     //$data['cart'] = $this->sale_lib->get_cart();
    //     data['modes'] = {
    //         'sale': this.lang.line('sales_sale'),
    //         'return': this.lang.line('sales_return')
    //     };
    //     data['mode'] = salesControllerLib.get_mode();
    //     data['stock_locations'] = this.Stock_location.get_allowed_locations('sales');
    //     data['stock_location'] = salesControllerLib.get_sale_location();
    //     data['subtotal'] = salesControllerLib.get_subtotal(true);
    //     data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //     //$data['taxes'] = $this->sale_lib->get_taxes();
    //     data['taxesArray'] = this.getAllCartItemTaxes();
    //     data['discount'] = salesControllerLib.get_discount();
    //     data['total'] = salesControllerLib.get_total();
    //     data['items_module_allowed'] = this.Employee.has_grant('items', person_info.person_id);
    //     data['comment'] = salesControllerLib.get_comment();
    //     data['email_receipt'] = salesControllerLib.get_email_receipt();
    //     data['payments_total'] = salesControllerLib.get_payments_total();
    //     data['amount_due'] = salesControllerLib.get_amount_due();
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['payment_options'] = {
    //         this.lang.line('sales_cash'): this.lang.line('sales_cash'),
    //         this.lang.line('sales_check'): this.lang.line('sales_check'),
    //         this.lang.line('sales_debit'): this.lang.line('sales_debit'),
    //         this.lang.line('sales_credit'): this.lang.line('sales_credit')
    //     };
    //     customer_id = customer_id;
    //     var cust_info;
    //     cust_info = '';
    //     if (customer_id != -1) {
    //         cust_info = this.Customer.get_info(customer_id);
    //         data['customer'] = cust_info.first_name.
    //         ' '.cust_info.last_name;
    //         data['customer_email'] = cust_info.email;
    //     }
    //     data['invoice_number'] = this._substitute_invoice_number(cust_info);
    //     data['invoice_number_enabled'] = salesControllerLib.is_invoice_number_enabled();
    //     data['print_after_sale'] = salesControllerLib.is_print_after_sale();
    //     data['payments_cover_total'] = this._payments_cover_total();
    //     //$this->load->view("sales/register",$data);
    //     console.log(json_encode({
    //         'data': data
    //     }));
    //     //TODO BK add this back
    //     //$this->_remove_duplicate_cookies();
    // }

    // function _reload(data) {
    //     if (typeof data == 'undefined') data = {};
    //     var person_info;
    //     person_info = this.Employee.get_logged_in_employee_info();
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['modes'] = {
    //         'sale': this.lang.line('sales_sale'),
    //         'return': this.lang.line('sales_return')
    //     };
    //     data['mode'] = salesControllerLib.get_mode();
    //     data['stock_locations'] = this.Stock_location.get_allowed_locations('sales');
    //     data['stock_location'] = salesControllerLib.get_sale_location();
    //     data['subtotal'] = salesControllerLib.get_subtotal(true);
    //     data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['discount'] = salesControllerLib.get_discount();
    //     data['total'] = salesControllerLib.get_total();
    //     data['items_module_allowed'] = this.Employee.has_grant('items', person_info.person_id);
    //     data['comment'] = salesControllerLib.get_comment();
    //     data['email_receipt'] = salesControllerLib.get_email_receipt();
    //     data['payments_total'] = salesControllerLib.get_payments_total();
    //     data['amount_due'] = salesControllerLib.get_amount_due();
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['payment_options'] = {
    //         this.lang.line('sales_cash'): this.lang.line('sales_cash'),
    //         this.lang.line('sales_check'): this.lang.line('sales_check'),
    //         this.lang.line('sales_giftcard'): this.lang.line('sales_giftcard'),
    //         this.lang.line('sales_debit'): this.lang.line('sales_debit'),
    //         this.lang.line('sales_credit'): this.lang.line('sales_credit')
    //     };
    //     var customer_id;
    //     customer_id = salesControllerLib.get_customer();
    //     var cust_info;
    //     cust_info = '';
    //     if (customer_id != -1) {
    //         cust_info = this.Customer.get_info(customer_id);
    //         data['customer'] = cust_info.first_name.
    //         ' '.cust_info.last_name;
    //         data['customer_email'] = cust_info.email;
    //     }
    //     data['invoice_number'] = this._substitute_invoice_number(cust_info);
    //     data['invoice_number_enabled'] = salesControllerLib.is_invoice_number_enabled();
    //     data['print_after_sale'] = salesControllerLib.is_print_after_sale();
    //     data['payments_cover_total'] = this._payments_cover_total();
    //     this.load.view('sales/register', data);
    // }

    // function cancel_sale() {
    //     salesControllerLib.clear_all();
    //     this._reload();
    // }

    // function cancel_saleRestApi() {
    //     salesControllerLib.clear_all();
    //     this._reload4RestApi();
    // }

    // function suspendSaleRestApi() {
    //     var data;
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     var customer_id;
    //     customer_id = salesControllerLib.get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     var comment;
    //     comment = salesControllerLib.get_comment();
    //     var invoice_number;
    //     invoice_number = salesControllerLib.get_invoice_number();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payment_type'] = this.input.post('payment_type');
    //     // Multiple payments
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = to_currency(salesControllerLib.get_amount_due() * -1);
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     if (customer_id != -1) {
    //         var cust_info;
    //         cust_info = this.Customer.get_info(customer_id);
    //         if (isset(cust_info.company_name)) {
    //             data['customer'] = cust_info.company_name;
    //         } else {
    //             data['customer'] = cust_info.first_name.
    //             ' '.cust_info.last_name;
    //         }
    //     }
    //     var total_payments;
    //     total_payments = 0;
    //     var _key_;
    //     for (_key_ in data['payments']) {
    //         var payment;
    //         payment = data['payments'][_key_];
    //         total_payments = bcadd(total_payments, payment['payment_amount'], PRECISION);
    //     }
    //     //SAVE sale to database
    //     data['sale_id'] = 'POS '.this.Sale_suspended.save(data['cart'], customer_id, employee_id, comment, invoice_number, data['payments']);
    //     if (data['sale_id'] == 'POS -1') {
    //         data['error_message'] = this.lang.line('sales_transaction_failed');
    //     }
    //     salesControllerLib.clear_all();
    //     data['success'] = this.lang.line('sales_successfully_suspended_sale');
    //     this._reload4RestApi(data);
    // }

    // function splitBillRestApi() {
    //     //
    //     // for Each item in Main
    //     //  add2CartRestApi
    //     // call saveSplitTableOrder
    //     // for Each item in second bill
    //     //  add2CartRestApi
    //     // call saveSplitTableOrder
    //     //Delete the Main initial order
    //     var tableNo, requestData;
    //     tableNo = requestData['tableno4split'];
    //     var oldOrderNo;
    //     oldOrderNo = requestData['order_no4split'];
    //     var guestNO;
    //     guestNO = requestData['guest_no'];
    //     var orderDesc;
    //     orderDesc = 'Main Split '.
    //     'for orderNo '.oldOrderNo;
    //     //$requestData['order_desc'];
    //     var orderDescNewsplit;
    //     orderDescNewsplit = 'New Split '.
    //     'for orderNo '.oldOrderNo;
    //     var reservation_id;
    //     reservation_id = requestData['reservation'];
    //     var mainSplitBillItems;
    //     mainSplitBillItems = requestData['mainSplitBill'];
    //     var secondSplitBillItems;
    //     secondSplitBillItems = requestData['newSplitBill'];
    //     var data;
    //     data = {};
    //     var orderNo;
    //     orderNo = this.Table.get_max_order_number(tableNo).order_no + 1;
    //     var parentOrderNo;
    //     parentOrderNo = this.Table.getParentOrderNo(oldOrderNo, tableNo).parent_order_no;
    //     if (parentOrderNo == -1) {
    //         parentOrderNo = oldOrderNo;
    //     }
    //     var _key_;
    //     for (_key_ in json_decode(mainSplitBillItems)) {
    //         var item;
    //         item = json_decode(mainSplitBillItems)[_key_];
    //         array_push(data, item);
    //     }
    //     for (_key_ in data) {
    //         var mainiBilltems;
    //         mainiBilltems = data[_key_];
    //         for (_key_ in mainiBilltems) {
    //             var item_id;
    //             item_id = mainiBilltems[_key_];
    //             var id;
    //             id = item_id.item_id;
    //             var i;
    //             for (i = 0; i < item_id.quantity_purchased; i++) {
    //                 this.additem4splitBillRestApi(id);
    //             }
    //         }
    //     }
    //     this.saveTableOrderRestApi4splitBill(tableNo, orderNo, parentOrderNo, guestNO, orderDesc, reservation_id);
    //     //$this->sale_lib->clear_all();
    //     data = {};
    //     orderNo = this.Table.get_max_order_number(tableNo).order_no + 1;
    //     for (_key_ in json_decode(secondSplitBillItems)) {
    //         item = json_decode(secondSplitBillItems)[_key_];
    //         array_push(data, item);
    //     }
    //     for (_key_ in data) {
    //         var secondBilltems;
    //         secondBilltems = data[_key_];
    //         id = secondBilltems.item_id;
    //         for (i = 0; i < secondBilltems.quantity_purchased; i++) {
    //             this.additem4splitBillRestApi(id);
    //         }
    //     }
    //     this.saveTableOrderRestApi4splitBill(tableNo, orderNo, parentOrderNo, guestNO, orderDescNewsplit, reservation_id);
    //     this.loadAllOrderItemBeforeCheckOutRestApi4split(tableNo, oldOrderNo);
    //     //  $this->delete
    //     //  $saleIds4ThisTableOrder = $this->Table->getSaleIds4ThisTablOrder($tableNo,$orderNo);
    //     // foreach ($saleIds4ThisTableOrder->result() as $saleId) {
    //     //   ($saleId->sale_id);
    //     // }
    //     var url;
    //     url = NodeServerUrl.
    //     '?event=updateTable&id='.tableNo.
    //     '&appType='.APPTYPE;
    //     url = urlencode(url);
    //     file_get_contents(urldecode(url));
    //     salesControllerLib.clear_all();
    // }

    // function getcart() {
    //     console.log(json_encode({
    //         0: salesControllerLib.get_cart()
    //     }));
    // }

    // function saveTableOrderRestApi4splitBill(tableNo, orderNo, parentOrderNo, guestNO, orderDesc, reservation_id) {
    //     tableNo = tableNo;
    //     orderNo = orderNo;
    //     var guests;
    //     guests = guestNO;
    //     var order_desc;
    //     order_desc = orderDesc;
    //     var reservationId;
    //     reservationId = reservation_id;
    //     var data;
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     //$customer_id = $this->sale_lib->get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     var comment;
    //     comment = salesControllerLib.get_comment();
    //     var invoice_number;
    //     invoice_number = salesControllerLib.get_invoice_number();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payment_type'] = this.input.post('payment_type');
    //     // Multiple payments
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = to_currency(salesControllerLib.get_amount_due() * -1);
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     if (customer_id != -1) {
    //         var customer_id, cust_info;
    //         cust_info = this.Customer.get_info(customer_id);
    //         if (isset(cust_info.company_name)) {
    //             data['customer'] = cust_info.company_name;
    //         } else {
    //             data['customer'] = cust_info.first_name.
    //             ' '.cust_info.last_name;
    //         }
    //     }
    //     var total_payments;
    //     total_payments = 0;
    //     var _key_;
    //     for (_key_ in data['payments']) {
    //         var payment;
    //         payment = data['payments'][_key_];
    //         total_payments = bcadd(total_payments, payment['payment_amount'], PRECISION);
    //     }
    //     //SAVE sale to database
    //     var saleId;
    //     saleId = this.Sale_suspended.save(data['cart'], customer_id, employee_id, comment, invoice_number, data['payments']);
    //     data['sale_id'] = 'POS '.saleId;
    //     if (data['sale_id'] == 'POS -1') {
    //         data['error_message'] = this.lang.line('sales_transaction_failed');
    //     }
    //     salesControllerLib.clear_all();
    //     data['success'] = this.lang.line('sales_successfully_suspended_sale');
    //     if (saleId != -1) {
    //         if (!this.Table.insertNewSaleinTable(tableNo, saleId, orderNo)) {
    //             data['error_message'] = 'Failed to add the sale_id to given table';
    //         }
    //         //TODO ANup
    //         if (!this.Table.insertNewOrderinTable(tableNo, guests, order_desc, orderNo, parentOrderNo, reservationId)) {
    //             data['error_message'] = 'Failed to add the sale_id to given table';
    //         }
    //     }
    //     this._reload4RestApi(data);
    // }

    // function loadAllOrderItemBeforeCheckOutRestApi4split(tableNo, oldOrderNo) {
    //     var table_no;
    //     table_no = tableNo;
    //     var order_no;
    //     order_no = oldOrderNo;
    //     //$table_no =15;
    //     //$order_no =2;
    //     var saleIds4ThisTableOrder;
    //     saleIds4ThisTableOrder = this.Table.getSaleIds4ThisTablOrder(table_no, order_no);
    //     salesControllerLib.clear_all();
    //     var _key_;
    //     for (_key_ in saleIds4ThisTableOrder.result()) {
    //         var saleId;
    //         saleId = saleIds4ThisTableOrder.result()[_key_];

    //         salesControllerLib.copyEntireKots4ThisOrder(saleId.sale_id);
    //         this.Sale_suspended.delete4Restaurant(saleId.sale_id, order_no, table_no);
    //     }
    //     this._reload4RestApi();
    //     //$this->_reload();
    // }

    // function additem4splitBillRestApi(item_id) {
    //     var data;
    //     data = {};
    //     var mode;
    //     mode = salesControllerLib.get_mode();
    //     var item_id_or_number_or_item_kit_or_receipt;
    //     item_id_or_number_or_item_kit_or_receipt = item_id;
    //     //$item_id_or_number_or_item_kit_or_receipt = $this->input->post("item");
    //     var quantity;
    //     quantity = mode == 'return' ? -1 : 1;
    //     var itemLocation;
    //     itemLocation = salesControllerLib.get_sale_location();
    //     if (mode == 'return' && salesControllerLib.isValidReceipt(item_id_or_number_or_item_kit_or_receipt)) {
    //         salesControllerLib.returnEntireSale(item_id_or_number_or_item_kit_or_receipt);
    //     } else {
    //         if (salesControllerLib.is_valid_item_kit(item_id_or_number_or_item_kit_or_receipt)) {
    //             salesControllerLib.addItemKit(item_id_or_number_or_item_kit_or_receipt, itemLocation);
    //         } else {
    //             if (!salesControllerLib.addItemToCart(item_id_or_number_or_item_kit_or_receipt, quantity, itemLocation, this.config.item('default_sales_discount'))) {
    //                 data['error'] = this.lang.line('sales_unable_to_addItemToCart');
    //             }
    //         }
    //     }
    //     if (salesControllerLib.out_of_stock(item_id_or_number_or_item_kit_or_receipt, itemLocation)) {
    //         data['warning'] = this.lang.line('sales_quantity_less_than_zero');
    //     }
    //     this._reload4RestApi(data);
    // }

    // function get_max_order_numberRestApi() {
    //     var table_no, requestData;
    //     table_no = requestData['table_no'];
    //     var data;
    //     data['order_no'] = this.Table.get_max_order_number(table_no).order_no + 1;
    //     console.log(json_encode({
    //         'data': data
    //     }));
    // }

    // function saveSplitTableOrder(tableNo, orderNo, guest, orderDesc) {
    //     //Identical to saveTableOrderRestApi
    // }

    // function saveTableOrderRestApi() {
    //     var tableNo, requestData;
    //     tableNo = requestData['table_no'];
    //     var data;
    //     data['tableNum'] = tableNo;
    //     var isNewOrder;
    //     isNewOrder = requestData['isNewOrder'];
    //     if (isNewOrder == 'true') {
    //         var orderNo;
    //         orderNo = this.Table.get_max_order_number(tableNo).order_no + 1;
    //     } else {
    //         orderNo = requestData['order_no'];
    //         if (requestData['isItEditKot'] == 'true') {
    //             var saleId_old;
    //             saleId_old = requestData['sales_id4kot'];
    //             this.Table.deleteKotinTable(saleId_old);
    //         }
    //     }
    //     var guests;
    //     guests = requestData['guests'];
    //     var order_desc;
    //     order_desc = requestData['order_desc'];
    //     var reservation_id;
    //     reservation_id = requestData['reservation_id'];
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     var customer_id;
    //     customer_id = salesControllerLib.get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     var comment;
    //     comment = salesControllerLib.get_comment();
    //     var invoice_number;
    //     invoice_number = salesControllerLib.get_invoice_number();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payment_type'] = this.input.post('payment_type');
    //     // Multiple payments
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = to_currency(salesControllerLib.get_amount_due() * -1);
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     if (customer_id != -1) {
    //         var cust_info;
    //         cust_info = this.Customer.get_info(customer_id);
    //         if (isset(cust_info.company_name)) {
    //             data['customer'] = cust_info.company_name;
    //         } else {
    //             data['customer'] = cust_info.first_name.
    //             ' '.cust_info.last_name;
    //         }
    //     }
    //     var total_payments;
    //     total_payments = 0;
    //     var _key_;
    //     for (_key_ in data['payments']) {
    //         var payment;
    //         payment = data['payments'][_key_];
    //         total_payments = bcadd(total_payments, payment['payment_amount'], PRECISION);
    //     }
    //     //SAVE sale to database
    //     var saleId;
    //     saleId = this.Sale_suspended.save(data['cart'], customer_id, employee_id, comment, invoice_number, data['payments']);
    //     data['sale_id'] = 'POS '.saleId;
    //     if (data['sale_id'] == 'POS -1') {
    //         data['error_message'] = this.lang.line('sales_transaction_failed');
    //     }
    //     salesControllerLib.clear_all();
    //     data['success'] = this.lang.line('sales_successfully_suspended_sale');
    //     if (saleId != -1) {
    //         if (!this.Table.insertNewSaleinTable(tableNo, saleId, orderNo)) {
    //             data['error_message'] = 'Failed to add the sale_id to given table';
    //         }
    //         // $isNewOrder=$requestData['isNewOrder'];
    //         if (isNewOrder == 'true') {
    //             if (!this.Table.insertNewOrderinTable(tableNo, guests, order_desc, orderNo, -1, reservation_id)) {
    //                 data['error_message'] = 'Failed to add the sale_id to given table';
    //             }
    //         }
    //         // else{
    //         //  if(!$this->Table->insertNewOrderinTable($tableNo,$guests,$order_desc,$orderNo,-1,$reservation_id))
    //         //  $data['error_message'] = "Failed to add the sale_id to given table";}
    //         this.printKOTRestApi(data);
    //         var url;
    //         url = NodeServerUrl.
    //         '?event=updateTable&id='.tableNo.
    //         '&appType='.APPTYPE;
    //         url = urlencode(url);
    //         file_get_contents(urldecode(url));
    //     }
    //     this._reload4RestApi(data);
    // }
    // //function printKOTRestApi($data){
    // function editSaveKOTRestApi() {
    //     var tableNo, requestData;
    //     tableNo = requestData['table_no'];
    //     var orderNo;
    //     orderNo = requestData['order_no'];
    //     var guests;
    //     guests = requestData['guests'];
    //     var order_desc;
    //     order_desc = requestData['order_desc'];
    //     var reservation_id;
    //     reservation_id = requestData['reservation_id'];
    //     var saleId_old;
    //     saleId_old = requestData['sales_id4kot'];
    //     this.Table.deleteKotinTable(saleId_old);
    //     var data;
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     var customer_id;
    //     customer_id = salesControllerLib.get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     var comment;
    //     comment = salesControllerLib.get_comment();
    //     var invoice_number;
    //     invoice_number = salesControllerLib.get_invoice_number();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payment_type'] = this.input.post('payment_type');
    //     // Multiple payments
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = to_currency(salesControllerLib.get_amount_due() * -1);
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     if (customer_id != -1) {
    //         var cust_info;
    //         cust_info = this.Customer.get_info(customer_id);
    //         if (isset(cust_info.company_name)) {
    //             data['customer'] = cust_info.company_name;
    //         } else {
    //             data['customer'] = cust_info.first_name.
    //             ' '.cust_info.last_name;
    //         }
    //     }
    //     var total_payments;
    //     total_payments = 0;
    //     var _key_;
    //     for (_key_ in data['payments']) {
    //         var payment;
    //         payment = data['payments'][_key_];
    //         total_payments = bcadd(total_payments, payment['payment_amount'], PRECISION);
    //     }
    //     //SAVE sale to database
    //     var saleId;
    //     saleId = this.Sale_suspended.save(data['cart'], customer_id, employee_id, comment, invoice_number, data['payments']);
    //     data['sale_id'] = 'POS '.saleId;
    //     if (data['sale_id'] == 'POS -1') {
    //         data['error_message'] = this.lang.line('sales_transaction_failed');
    //     }
    //     salesControllerLib.clear_all();
    //     data['success'] = this.lang.line('sales_successfully_suspended_sale');
    //     if (saleId != -1) {
    //         if (!this.Table.insertNewSaleinTable(tableNo, saleId, orderNo)) {
    //             data['error_message'] = 'Failed to add the sale_id to given table';
    //         }
    //         //TODO ANup
    //         if (!this.Table.insertNewOrderinTable(tableNo, guests, order_desc, orderNo, reservation_id)) {
    //             data['error_message'] = 'Failed to add the sale_id to given table';
    //         }
    //     }
    //     this._reload4RestApi(data);
    // }

    // function saveDeliveryRetailRestApi() {
    //     var customer_id, requestData;
    //     customer_id = requestData['customer_id'];
    //     var data;
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     //$customer_id = $this->sale_lib->get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     var comment;
    //     comment = salesControllerLib.get_comment();
    //     var invoice_number;
    //     invoice_number = salesControllerLib.get_invoice_number();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payment_type'] = this.input.post('payment_type');
    //     // Multiple payments
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = to_currency(salesControllerLib.get_amount_due() * -1);
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     if (customer_id != -1) {
    //         var cust_info;
    //         cust_info = this.Customer.get_info(customer_id);
    //         if (isset(cust_info.company_name)) {
    //             data['customer'] = cust_info.company_name;
    //         } else {
    //             data['customer'] = cust_info.first_name.
    //             ' '.cust_info.last_name;
    //         }
    //     } else {
    //         data['customer'] = 'XXXXXXX';
    //     }
    //     var total_payments;
    //     total_payments = 0;
    //     var _key_;
    //     for (_key_ in data['payments']) {
    //         var payment;
    //         payment = data['payments'][_key_];
    //         total_payments = bcadd(total_payments, payment['payment_amount'], PRECISION);
    //     }
    //     //SAVE sale to database
    //     var saleId;
    //     saleId = this.Sale_suspended.save(data['cart'], customer_id, employee_id, comment, invoice_number, data['payments']);
    //     data['sale_id'] = 'POS '.saleId;
    //     if (data['sale_id'] == 'POS -1') {
    //         data['error_message'] = this.lang.line('sales_transaction_failed');
    //     }
    //     salesControllerLib.clear_all();
    //     data['success'] = this.lang.line('sales_successfully_suspended_sale');
    //     if (saleId != -1) {
    //         if (!this.Table.insertNewDeliveryRetailSaleinTable(saleId, customer_id)) {
    //             data['error_message'] = 'Failed to add the sale_id to given table';
    //         }
    //     }
    //     var url;
    //     url = NodeServerUrl.
    //     '?event=saveHomeDelivery&id='.saleId.
    //     '&appType='.APPTYPE;
    //     url = urlencode(url);
    //     file_get_contents(urldecode(url));
    //     this._reload4Homedelivery(data, customer_id);
    // }

    // function saveTwoTerminalOdersRestApi() {
    //     var customer_id, requestData;
    //     customer_id = requestData['customer_id'];
    //     var data;
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     //$customer_id = $this->sale_lib->get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     var comment;
    //     comment = salesControllerLib.get_comment();
    //     var invoice_number;
    //     invoice_number = salesControllerLib.get_invoice_number();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payment_type'] = this.input.post('payment_type');
    //     // Multiple payments
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = to_currency(salesControllerLib.get_amount_due() * -1);
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     if (customer_id != -1) {
    //         var cust_info;
    //         cust_info = this.Customer.get_info(customer_id);
    //         if (isset(cust_info.company_name)) {
    //             data['customer'] = cust_info.company_name;
    //         } else {
    //             data['customer'] = cust_info.first_name.
    //             ' '.cust_info.last_name;
    //         }
    //     }
    //     var total_payments;
    //     total_payments = 0;
    //     var _key_;
    //     for (_key_ in data['payments']) {
    //         var payment;
    //         payment = data['payments'][_key_];
    //         total_payments = bcadd(total_payments, payment['payment_amount'], PRECISION);
    //     }
    //     //SAVE sale to database
    //     var saleId;
    //     saleId = this.Sale_suspended.save(data['cart'], customer_id, employee_id, comment, invoice_number, data['payments']);
    //     data['sale_id'] = 'POS '.saleId;
    //     if (data['sale_id'] == 'POS -1') {
    //         data['error_message'] = this.lang.line('sales_transaction_failed');
    //     }
    //     salesControllerLib.clear_all();
    //     data['success'] = this.lang.line('sales_successfully_suspended_sale');
    //     if (saleId != -1) {
    //         if (!this.TwoterminalPaymentModel.insertSaleinTwoTerminalOrderTable(saleId, customer_id)) {
    //             data['error_message'] = 'Failed to add the sale_id to given table';
    //         }
    //     }
    //     // $orderDataForMultipleTerminal=$this->TwoterminalPaymentModel->getOrderIdForMultipleTerminal($saleId)->result();
    //     // $orderIdForMultipleTerminal=$orderDataForMultipleTerminal[0]->order_id;
    //     var url;
    //     url = NodeServerUrl.
    //     '?event=saveOrderForCounter&id='.saleId.
    //     '&appType='.APPTYPE;
    //     url = urlencode(url);
    //     file_get_contents(urldecode(url));
    //     this._reload4Homedelivery(data, customer_id);
    // }
    // // function checknw(){
    // //  $saleId=1;
    // //  $orderIdForMultipleTerminal=$this->TwoterminalPaymentModel->getOrderIdForMultipleTerminal($saleId)->result();
    // //  echo json_encode($orderIdForMultipleTerminal[0]->order_id);
    // // }
    // function suspend() {
    //     var data;
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     var customer_id;
    //     customer_id = salesControllerLib.get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     var comment;
    //     comment = salesControllerLib.get_comment();
    //     var invoice_number;
    //     invoice_number = salesControllerLib.get_invoice_number();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payment_type'] = this.input.post('payment_type');
    //     // Multiple payments
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = to_currency(salesControllerLib.get_amount_due() * -1);
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     if (customer_id != -1) {
    //         var cust_info;
    //         cust_info = this.Customer.get_info(customer_id);
    //         if (isset(cust_info.company_name)) {
    //             data['customer'] = cust_info.company_name;
    //         } else {
    //             data['customer'] = cust_info.first_name.
    //             ' '.cust_info.last_name;
    //         }
    //     }
    //     var total_payments;
    //     total_payments = 0;
    //     var _key_;
    //     for (_key_ in data['payments']) {
    //         var payment;
    //         payment = data['payments'][_key_];
    //         total_payments = bcadd(total_payments, payment['payment_amount'], PRECISION);
    //     }
    //     //SAVE sale to database
    //     data['sale_id'] = 'POS '.this.Sale_suspended.save(data['cart'], customer_id, employee_id, comment, invoice_number, data['payments']);
    //     if (data['sale_id'] == 'POS -1') {
    //         data['error_message'] = this.lang.line('sales_transaction_failed');
    //     }
    //     salesControllerLib.clear_all();
    //     this._reload({
    //         'success': this.lang.line('sales_successfully_suspended_sale')
    //     });
    // }

    // function suspended() {
    //     var data;
    //     data = {};
    //     data['suspended_sales'] = this.Sale_suspended.get_all().result_array();
    //     this.load.view('sales/suspended', data);
    // }

    // function allSuspendedSalesRestApi() {
    //     var data;
    //     data = {};
    //     data['suspended_sales'] = this.Sale_suspended.get_all().result_array();
    //     var data4tableSales;
    //     data4tableSales = this.Reserve.getnlysales().result();
    //     console.log(json_encode({
    //         'susSales': data,
    //         'data4tableSales': data4tableSales
    //     }));
    // }

    // function unsuspendSaleRestApi() {
    //     var sale_id, requestData;
    //     sale_id = requestData['suspended_sale_id'];
    //     salesControllerLib.clear_all();
    //     salesControllerLib.copy_entire_suspended_sale(sale_id);
    //     this.Sale_suspended.delete(sale_id);
    //     this._reload4RestApi();
    // }

    // function deleteKotForOrderRestApi() {
    //     var sale_id, requestData;
    //     sale_id = requestData['deleteKotForOrder_sale_id'];
    //     var table_no4deleteKot;
    //     table_no4deleteKot = requestData['table_no'];
    //     var order_no4deleteKot;
    //     order_no4deleteKot = requestData['order_no'];
    //     salesControllerLib.clear_all();
    //     salesControllerLib.copy_entire_suspended_sale(sale_id);
    //     this.Sale_suspended.delete(sale_id);
    //     this.Table.deleteKot4Order(sale_id, table_no4deleteKot, order_no4deleteKot);
    //     var deleteOrder;
    //     deleteOrder = requestData['deleteOrder'];
    //     // if($deleteOrder==true){
    //     //  $this->Table->deleteOrderfunc($table_no4deleteKot,$order_no4deleteKot);
    //     // }
    //     this._reload4RestApi();
    // }

    // function unsuspendSaleRestaurantRestApi() {
    //     var sale_id, requestData;
    //     sale_id = requestData['suspended_sale_id'];
    //     salesControllerLib.clear_all();
    //     salesControllerLib.copy_entire_suspended_sale(sale_id);
    //     this.Sale_suspended.delete4Restaurant(sale_id);
    //     this._reload4RestApi();
    // }

    // function loadKotToCartRestApi() {
    //     var sale_id, requestData;
    //     sale_id = requestData['sales_id'];
    //     salesControllerLib.clear_all();
    //     var data;
    //     data = salesControllerLib.copy_entire_suspended_sale4kot(sale_id);
    //     //echo json_encode(array($data));
    //     //$this->Sale_suspended->delete($sale_id);
    //     this._reload4RestApi();
    // }

    // function unsuspendDeliveryRestApi() {
    //     var sale_id, requestData;
    //     sale_id = requestData['sale_id'];
    //     salesControllerLib.clear_all();
    //     salesControllerLib.copy_entire_suspended_Delivery(sale_id);
    //     var data;
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['discounted_subtotal'] = salesControllerLib.get_subtotal(true);
    //     data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['taxesData'] = this.getAllCartItemTaxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['discount'] = salesControllerLib.get_discount();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     data['transaction_date'] = date(this.config.item('dateformat'));
    //     data['show_stock_locations'] = this.Stock_location.show_locations('sales');
    //     var customer_id;
    //     customer_id = salesControllerLib.get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     data['comments'] = salesControllerLib.get_comment();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = salesControllerLib.get_amount_due() * -1;
    //     data['amount_due'] = salesControllerLib.get_amount_due();
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     data['company_info'] = implode('\n\
    // ', {
    //         0: this.config.item('address'),
    //         1: this.config.item('phone'),
    //         2: this.config.item('account_number')
    //     });
    //     data['company_address'] = this.config.item('address');
    //     data['company_phone'] = this.config.item('phone');
    //     data['company_account'] = this.config.item('account_number');
    //     data['company_name'] = this.config.item('company');
    //     var invoice_number;
    //     invoice_number = salesControllerLib.is_invoice_number_enabled() ? invoice_number : NULL;
    //     data['invoice_number'] = invoice_number;
    //     this._reload4RestApi(data);
    // }

    // function unsuspendOrders4TwoTerminalRestApi() {
    //     var sale_id, requestData;
    //     sale_id = requestData['sale_id'];
    //     salesControllerLib.clear_all();
    //     salesControllerLib.copy_entire_suspended_Delivery(sale_id);
    //     var data;
    //     data['cart'] = salesControllerLib.get_cart();
    //     data['subtotal'] = salesControllerLib.get_subtotal();
    //     data['discounted_subtotal'] = salesControllerLib.get_subtotal(true);
    //     data['tax_exclusive_subtotal'] = salesControllerLib.get_subtotal(true, true);
    //     data['taxes'] = salesControllerLib.get_taxes();
    //     data['taxesData'] = this.getAllCartItemTaxes();
    //     data['total'] = salesControllerLib.get_total();
    //     data['discount'] = salesControllerLib.get_discount();
    //     data['receipt_title'] = this.lang.line('sales_receipt');
    //     data['transaction_time'] = date(this.config.item('dateformat').
    //         ' '.this.config.item('timeformat'));
    //     data['transaction_date'] = date(this.config.item('dateformat'));
    //     data['show_stock_locations'] = this.Stock_location.show_locations('sales');
    //     var customer_id;
    //     customer_id = salesControllerLib.get_customer();
    //     var employee_id;
    //     employee_id = this.Employee.get_logged_in_employee_info().person_id;
    //     data['comments'] = salesControllerLib.get_comment();
    //     var emp_info;
    //     emp_info = this.Employee.get_info(employee_id);
    //     data['payments'] = salesControllerLib.get_payments();
    //     data['amount_change'] = salesControllerLib.get_amount_due() * -1;
    //     data['amount_due'] = salesControllerLib.get_amount_due();
    //     data['employee'] = emp_info.first_name.
    //     ' '.emp_info.last_name;
    //     data['company_info'] = implode('\n\
    // ', {
    //         0: this.config.item('address'),
    //         1: this.config.item('phone'),
    //         2: this.config.item('account_number')
    //     });
    //     data['company_address'] = this.config.item('address');
    //     data['company_phone'] = this.config.item('phone');
    //     data['company_account'] = this.config.item('account_number');
    //     data['company_name'] = this.config.item('company');
    //     var invoice_number;
    //     invoice_number = salesControllerLib.is_invoice_number_enabled() ? invoice_number : NULL;
    //     data['invoice_number'] = invoice_number;
    //     this._reload4RestApi(data);
    // }

    // function loadAllOrderItemBeforeCheckOutRestApi() {
    //     var table_no, requestData;
    //     table_no = requestData['table_no'];
    //     var order_no;
    //     order_no = requestData['order_no'];
    //     //$table_no =15;
    //     //$order_no =2;
    //     var saleIds4ThisTableOrder;
    //     saleIds4ThisTableOrder = this.Table.getSaleIds4ThisTablOrder(table_no, order_no);
    //     /*  $ResultJson=array();
    //     foreach ($saleIds4ThisTableOrder->result() as $saleId) {
    //         $item4ThisKot=$this->Table->getItemsforThisKot($saleId->sale_id);
    //         $ResultJson[$saleId->sale_id]=$item4ThisKot->result();
    //     }*/
    //     salesControllerLib.clear_all();
    //     var _key_;
    //     for (_key_ in saleIds4ThisTableOrder.result()) {
    //         var saleId;
    //         saleId = saleIds4ThisTableOrder.result()[_key_];

    //         salesControllerLib.copyEntireKots4ThisOrder(saleId.sale_id);
    //         //$this->Sale_suspended->delete4Restaurant($saleId->sale_id,$order_no);
    //     }
    //     this._reload4RestApi();
    //     //$this->_reload();
    // }

    // function unsuspend() {
    //     var sale_id;
    //     sale_id = this.input.post('suspended_sale_id');
    //     salesControllerLib.clear_all();
    //     salesControllerLib.copy_entire_suspended_sale(sale_id);
    //     this.Sale_suspended.delete(sale_id);
    //     this._reload();
    // }

    // function getItemDiscountRestApi() {
    //     //$item_id = $requestData['item'];
    //     var discount_data;
    //     discount_data = this.Item_taxes.get_Discount_info();
    //     var _key_;
    //     for (_key_ in discount_data) {
    //         var mydiscount;
    //         mydiscount = discount_data[_key_];

    //         var item_discount;
    //         item_discount[] = mydiscount;
    //     }
    //     console.log(json_encode({
    //         'item_discount': item_discount
    //     }));
    // }

    // function check_invoice_number() {
    //     var sale_id;
    //     sale_id = this.input.post('sale_id');
    //     var invoice_number;
    //     invoice_number = this.input.post('invoice_number');
    //     var exists;
    //     exists = !empty(invoice_number) && this.Sale.invoice_number_exists(invoice_number, sale_id);
    //     console.log(json_encode({
    //         'success': !exists,
    //         'message': this.lang.line('sales_invoice_number_duplicate')
    //     }));
    // } 
    return salesController;
};