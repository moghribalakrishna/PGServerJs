/*jshint sub:true*/
var Models = require('../../models');
var ItemsModel = Models.profitGuru_items;
var ItemKitsModel = Models.profitGuru_item_kits;
var salesModel = Models.profitGuru_sales;
var salesItemsModel = Models.profitGuru_sales_items;
var customerModel = Models.profitGuru_customers;
var ItemTaxsModel = Models.profitGuru_items_taxes;

var math = require('mathjs');

module.exports = function(requestSession) {
    return salesControllerLib(requestSession);
};

function salesControllerLib(session) {
    //session = session;


    this.setCartCustomerDetails = function() {

        if (session.customer) {
            return customerModel.findById(session.customer).then(function(customer4Cart) {
                if (customer4Cart) {
                    this.customerDetails = customer4Cart.get({
                        plain: true
                    });

                }
            });
        } else {
            this.customerDetails = {};
            Promise.resolve();
        }


    };

    this.getCartCustomerDetails = function() {
        return this.customerDetails;
    }

    this.getAbout2AddItemDetails = function(item_id) {
        return ItemsModel.getThisItemInfo(item_id).then(function(thisItemInfo) {
            if (thisItemInfo) {
                this.add2CartItemInfo = thisItemInfo;
            } else {
                throw new Error(' Item with ItemId=' + item_id + ' Doesnot Exists, so Cannot add to Cart');
            }
        });
    };

    this.get_mode = function() {
        if (!session.sale_mode) {
            session.sale_mode = 'sale';
        }
        return session.sale_mode;
        // if (!this.CI.session.userdata('sale_mode')) {
        //     this.set_mode('sale');
        // }
        // return this.CI.session.userdata('sale_mode');
    };
    this.get_cart = function() {
        if (!session.cart) {
            session.cart = [];
        }
        return session.cart;
    };

    this.set_cart = function(salesCartData) {
        session.cart = salesCartData;
    };
    this.set_mode = function(mode) {
        session.sale_mode = mode;
    };

    this.get_sale_location = function() {
        //TODO should return location and location name
        session.location_id = 1;

        return session.location_id;
        //TODO 
        // if (!this.CI.session.userdata('sale_location')) {
        //     var location_id;
        //     location_id = t
        //his.CI.Stock_location.get_default_location_id();
        //     this.set_sale_location(location_id);
        // }
        // return this.CI.session.userdata('sale_location');
    };

    this.getSaleIdFromReceiptOrInvoiceNumber = function(receiptNumberOrInvoiceNumber) {

        var parts = receiptNumberOrInvoiceNumber.split(' ');
        if (count(parts) === 2 && strtolower(parts[0]) === 'pos') {
            var saleId = pieces[1];
            return salesModel.isSaleExists(saleId);
        } else {

            return salesModel.getSaleIdFromInvoiceNumber(receiptNumberOrInvoiceNumber);
        }

    };

    this.isValidItemKit = function(itemKitId) {

        //TODO find out why we need here split
        //itemKitId = itemKitId.split(' ', itemKitId)[1];
        return ItemKitsModel.findById(itemKitId);

    };

    this.returnEntireSale = function(saleId) {
        var _self = this;
        this.emptyCart();
        this.removeCustomer();
        return salesItemsModel.getAllSaleItems(function(saleItemList) {
            //TODO Next
            saleItemList.forEach(function(saleEntry) {
                _self.addItemToCart(saleEntry.item_id, -(saleEntry.quantity_purchased), saleEntry.item_location, saleEntry.discount_percent, saleEntry.item_unit_price, saleEntry.description, saleEntry.serialnumber);
            });
            this.set_customer(this.CI.Sale.get_customer(sale_id).person_id);
        });
        // var _key_;
        // for (_key_ in this.CI.Sale.get_sale_items(sale_id).result()) {
        //     var row;
        //     row = this.CI.Sale.get_sale_items(sale_id).result()[_key_];
        //     this.addItemToCart(row.item_id, -row.quantity_purchased, row.item_location, row.discount_percent, row.item_unit_price, row.description, row.serialnumber);
        // }

    };

    this.emptyCart = function() {
        session.cart = [];
    };

    this.getPreAddToCartSaleDetails = function() {

    };

    this.get_item_total = function(quantity, price, discount_percentage, include_discount) {
        if (typeof include_discount == 'undefined') {
            return getItemTotal(quantity, price);
        } else {
            return getItemDisCountedTotal(quantity, price, discount_percentage);
        }
    };

    this.getItemTotal = function(quantity, price) {

        return math.multiply(quantity, price);
    };

    this.getItemDisCountedTotal = function(quantity, price, discount_percentage) {

        var total = math.multiply(quantity, price);
        var discount_amount = this.getItemDiscount(quantity, price, discount_percentage);
        return math.subtract(total, discount_amount);

    };
    this.getItemDiscount = function(quantity, price, discount_percentage) {
        var total = math.multiply(quantity, price);
        var discount_fraction = math.divide(discount_percentage, 100);
        return math.multiply(total, discount_fraction);
    };

    this.get_subtotal = function(include_discount, exclude_tax) {
        include_discount = include_discount || false;
        exclude_tax = exclude_tax || false;
        var subtotal = this.calculate_subtotal(include_discount, exclude_tax);
        //TODO
        //return to_currency_no_money(subtotal);
        return subtotal;
    };

    this.get_item_tax = function(quantity, price, discount_percentage, tax_percentage) {
        price = this.get_item_total(quantity, price, discount_percentage, true);
        var tax_fraction;
        var price_tax_excl;
        //TODO get this from settings, as of now considering true
        //if (this.CI.config.config['tax_included']) {

        if (true) {
            tax_fraction = math.add(100, tax_percentage);
            tax_fraction = math.divide(tax_fraction, 100);
            price_tax_excl = math.divide(price, tax_fraction);
            return math.subtract(price, price_tax_excl);
        }
        tax_fraction = math.divide(tax_percentage, 100);
        return math.multiply(price, tax_fraction);
    };

    this.get_item_total_tax_exclusive = function(item_id, quantity, price, discount_percentage, include_discount) {
        include_discount = include_discount || false;

        var tax_info = this.CI.Item_taxes.get_info(item_id);
        var item_price = this.get_item_total(quantity, price, discount_percentage, include_discount);
        // only additive tax here
        for (var index in tax_info) {
            var tax = tax_info[index];
            var tax_percentage = tax['percent'];
            item_price = math.subtract(item_price, this.get_item_tax(quantity, price, discount_percentage, tax_percentage));
        }
        return item_price;
    };

    this.calculate_subtotal = function(include_discount, exclude_tax) {
        include_discount = include_discount || false;
        exclude_tax = exclude_tax || false;

        var subtotal = 0;
        for (var index in session.cart) {
            var item = session.cart[index];
            //TODO get this from settings, as of now considering true
            //if (exclude_tax && this.CI.config.config['tax_included']) {
            if (exclude_tax && true) {
                subtotal = math.add(subtotal, this.get_item_total_tax_exclusive(item['item_id'], item['quantity'], item['price'], item['discount'], include_discount));
            } else {
                subtotal = math.add(subtotal, this.get_item_total(item['quantity'], item['price'], item['discount'], include_discount));
            }
        }
        return subtotal;
    };

    this.removeCustomer = function() {
        delete session.customer;
    };

    this.set_customer = function(customer_id) {
        session.customer = customer_id;
    };

    this.get_customer = function() {
        if (!session.customer) {
            session.customer = -1;
        }
        return session.customer;
    };

    this.is_customer_taxable = function() {
        if (!this.customerDetails.taxable) {
            return true;
        } else {
            return this.customerDetails.taxable;
        }

    };

    this.get_taxes = function() {

        this.taxes = {};
        return this.is_customer_taxable().then(function(isCustomerTaxable) {
            if (!isCustomerTaxable) {
                return taxes;
            } else {
                var allItemsTaxInfoPromises = session.cart.map(function(currentCartItem) {
                    return new Promise(function(resolve, reject) {
                        return ItemTaxsModel.findById(currentCartItem.item_id).then(function(thisItemTaxInfo) {
                            resolve({
                                item: currentCartItem,
                                itemTaxInfo: thisItemTaxInfo.get({
                                    plain: true
                                })
                            });

                        });
                    });
                });

                return Promise.each(allItemsTaxInfoPromises, function(cartItemWithTaxInfo) {

                    cartItemWithTaxInfo.itemTaxInfo.map(function(thisTax, index) {
                        var taxName = thisTax.percent + '% ' + thisTax.name;
                        var tax_amount = this.get_item_tax(cartItemWithTaxInfo[index].item.quantity, cartItemWithTaxInfo[index].item.price, cartItemWithTaxInfo[index].item.discount, thisTax.percent);
                        if (!this.taxes.taxName) {
                            this.taxes.taxName = 0;
                        }
                        this.taxes[taxName] = math.add(this.taxes[taxName], tax_amount);

                    });
                });
            }

        });

        //Do not charge sales tax if we have a customer that is not taxable

        // if (!this.is_customer_taxable()) {
        //     return {};
        // }
        // var taxes = {};

        // for (var line in this.get_cart()) {

        //     var item = this.get_cart()[line];
        //     var tax_info = this.CI.Item_taxes.get_info(item['item_id']);
        //     var _key_;
        //     for (_key_ in tax_info) {

        //         var tax = tax_info[_key_];
        //         var name = tax['percent'] + '% ' + tax['name'];
        //         var tax_percentage = tax['percent'];
        //         var tax_amount = this.get_item_tax(item['quantity'], item['price'], item['discount'], tax_percentage);

        //         if (!isset(taxes[name])) {
        //             taxes[name] = 0;
        //         }

        //         taxes[name] = bcadd(taxes[name], tax_amount, PRECISION);
        //     }
        // }
        // return taxes;
    };

    this.addItem2Cart = function(item_id, quantity, itemLocation, discount, price, description, serialnumber) {

        return Promise.all([this.setCartCustomerDetails(), this.getAbout2AddItemDetails(item_id)]).then(function() {
            quantity = quantity || 1;
            discount = discount || 0;
            price = price || null;
            description = description || null;
            serialnumber = serialnumber || null;

            return new Promise(function(resolve, reject) {

                if (this.add2CartItemInfo) {

                    var salesCart = this.get_cart();
                    var maxkey = 0;

                    var itemalreadyinsale = false;
                    //We did not find the item yet.
                    var insertkey = 0;
                    //Key to use for new entry.
                    var updatekey = 0;
                    //Key to use to update(quantity)

                    var discount = thisItemInfo.Discounts.discount;

                    for (var index in salesCart) {

                        var cartItem = salesCart[index];
                        //We primed the loop so maxkey is 0 the first time.
                        //Also, we have stored the key in the element itself so we can compare.
                        if (maxkey <= cartItem['line']) {
                            maxkey = cartItem['line'];
                        }

                        if (cartItem['item_id'] == item_id && cartItem['item_location'] == itemLocation) {
                            itemalreadyinsale = true;
                            updatekey = cartItem['line'];
                            if (!thisItemInfo.is_serialized) {
                                quantity += salesCart[updatekey]['quantity'];
                            }
                        }
                    }

                    insertkey = maxkey + 1;
                    //array/cart records are identified by $insertkey and item_id is just another field.
                    price = price !== null ? price : thisItemInfo.unit_price;

                    var total = this.getItemTotal(quantity, price, discount);

                    var discounted_total = this.getItemDisCountedTotal(quantity, price, discount);

                    //Item already exists and is not serialized, add to quantity
                    if (!itemalreadyinsale || thisItemInfo.is_serialized) {
                        var item = {};
                        item[insertkey] = {
                            'item_id': item_id,
                            'item_location': itemLocation,
                            'stock_name': thisItemInfo.Quantity.StockLocation.location_name,
                            'line': insertkey,
                            'name': thisItemInfo.name,
                            'item_number': thisItemInfo.item_number,
                            'description': description !== null ? description : thisItemInfo.description,
                            'serialnumber': serialnumber !== null ? serialnumber : '',
                            'allow_alt_description': thisItemInfo.allow_alt_description,
                            'is_serialized': thisItemInfo.is_serialized,
                            'quantity': quantity,
                            'discount': discount,
                            'in_stock': thisItemInfo.Quantity.quantity,
                            'price': price,
                            'total': total,
                            'discounted_total': discounted_total,
                            'discounted_price': this.getItemDiscount(quantity, price, discount),
                            'loyaltyPerc': thisItemInfo.loyaltyPerc

                        };
                        salesCart.push(item);

                    } else {

                        salesCart[updatekey]['quantity'] = quantity;
                        salesCart[updatekey]['total'] = total;
                        salesCart[updatekey]['discounted_total'] = discounted_total;
                    }
                    this.set_cart(salesCart);
                    resolve(true);

                } else {
                    reject(' Item with ItemId=' + item_id + ' Doesnot Exists, so Cannot add to Cart');
                }


            });
        });
    };

    this.get_quantity_already_added = function(item_id, item_location) {

        var quanity_already_added = 0;
        for (var index in session.cart) {
            var item = session.cart[index];
            if (item['item_id'] == item_id && item['item_location'] == item_location) {
                quanity_already_added += item['quantity'];
            }
        }
        return quanity_already_added;
    };

    this.out_of_stock = function(item_id, item_location) {
        //make sure item exists
        // if (this.validate_item(item_id) == false) {
        //     return false;
        // }
        if (!this.add2CartItemInfo) {
            throw Error('No Item Info found');
            //             var item_info;
            // item_info = this.CI.Item.get_info(item_id);
        }

        var quantity_added = this.get_quantity_already_added(item_id, item_location);
        if (this.add2CartItemInfo.Quantity.quantity - quantity_added < 0) {
            return 'sales_quantity_less_than_zero';
        } else {
            if (this.add2CartItemInfo.Quantity.quantity - quantity_added < this.add2CartItemInfo.reorder_level) {
                return 'sales_quantity_less_than_reorder_level';
            }
        }
        return false;
    };

    this.get_discount = function() {

        var discount = 0;
        var index;
        for (index in session.cart) {
            var item = session.cart[index];
            if (item['discount'] > 0) {

                var item_discount = this.getItemDiscount(item['quantity'], item['price'], item['discount']);
                discount = math.add(discount, item_discount);
            }
        }
        return discount;
    };

    this.get_total = function() {

        var total = this.calculate_subtotal(true);
        //TODO get this from settings
        //if (!this.CI.config.config['tax_included']) {
        if (false) {

            for (var index in this.taxes) {
                var tax = this.taxes[index];
                total = math.add(total, tax);
            }
        }
        //TODO 
        //return to_currency_no_money(total);
        return total;
    };


    this.get_comment = function() {
        // avoid returning a null that results in a 0 in the comment if nothing is set/available

        return !session.comment ? '' : comment;
    };

    this.get_email_receipt = function() {
        return session.email_receipt;
    };

    this.get_payments_total = function() {

        var subtotal = 0;
        var index;
        for (index in session.payments) {

            var payments = session.payments[index];
            subtotal = math.add(payments['payment_amount'], subtotal);
        }
        //TODO
        //return to_currency_no_money(subtotal);

        return subtotal;
    };

    this.get_payments = function() {
        if (!session.payments) {
            session.payments = {};
        }
        return session.payments;
    };

    this.set_payments = function(payments_data) {
        session.payments = payments_data;
    };

    this.get_amount_due = function() {

        var amount_due = 0;
        var payment_total = this.get_payments_total();
        var sales_total = this.get_total();

        //TODO
        //amount_due = to_currency_no_money(bcsub(sales_total, payment_total));
        amount_due = math.subtract(sales_total, payment_total);
        return amount_due;
    };

    // this.set_comment = function(comment) {
    //     this.CI.session.set_userdata('comment', comment);
    // };
    // this.clear_comment = function() {
    //     this.CI.session.unset_userdata('comment');
    // };
    // this.get_invoice_number = function() {
    //     return this.CI.session.userdata('sales_invoice_number');
    // };
    // this.set_invoice_number = function(invoice_number, keep_custom) {
    //     if (typeof keep_custom == 'undefined') keep_custom = false;
    //     var current_invoice_number;
    //     current_invoice_number = this.CI.session.userdata('sales_invoice_number');
    //     if (!keep_custom || empty(current_invoice_number)) {
    //         this.CI.session.set_userdata('sales_invoice_number', invoice_number);
    //     }
    // };
    // this.clear_invoice_number = function() {
    //     this.CI.session.unset_userdata('sales_invoice_number');
    // };
    // this.is_invoice_number_enabled = function() {
    //     return this.CI.session.userdata('sales_invoice_number_enabled') == 'true' || this.CI.session.userdata('sales_invoice_number_enabled') == '1';
    // };
    // this.set_invoice_number_enabled = function(invoice_number_enabled) {
    //     return this.CI.session.set_userdata('sales_invoice_number_enabled', invoice_number_enabled);
    // };
    // this.is_print_after_sale = function() {
    //     return this.CI.session.userdata('sales_print_after_sale') == 'true' || this.CI.session.userdata('sales_print_after_sale') == '1';
    // };
    // this.set_print_after_sale = function(print_after_sale) {
    //     return this.CI.session.set_userdata('sales_print_after_sale', print_after_sale);
    // };

    // this.set_email_receipt = function(email_receipt) {
    //     this.CI.session.set_userdata('email_receipt', email_receipt);
    // };
    // this.clear_email_receipt = function() {
    //     this.CI.session.unset_userdata('email_receipt');
    // };
    // this.add_payment = function(payment_id, payment_amount) {
    //     var payments;
    //     payments = this.get_payments();
    //     if (isset(payments[payment_id])) {
    //         //payment_method already exists, add to payment_amount
    //         payments[payment_id]['payment_amount'] = bcadd(payments[payment_id]['payment_amount'], payment_amount, PRECISION);
    //     } else {
    //         //add to existing array
    //         var payment;
    //         payment = {
    //             payment_id: {
    //                 'payment_type': payment_id,
    //                 'payment_amount': payment_amount
    //             }
    //         };
    //         payments += payment;
    //     }
    //     this.set_payments(payments);
    //     return true;
    // };
    // this.edit_payment = function(payment_id, payment_amount) {
    //     var payments;
    //     payments = this.get_payments();
    //     if (isset(payments[payment_id])) {
    //         payments[payment_id]['payment_type'] = payment_id;
    //         payments[payment_id]['payment_amount'] = payment_amount;
    //         this.set_payments(payments);
    //     }
    //     return false;
    // };
    // this.delete_payment = function(payment_id) {
    //     var payments;
    //     payments = this.get_payments();
    //     delete payments[urldecode(payment_id)];
    //     this.set_payments(payments);
    // };
    // this.empty_payments = function() {
    //     this.CI.session.unset_userdata('payments');
    // };



    // this.set_sale_location = function(location) {
    //     this.CI.session.set_userdata('sale_location', location);
    // };
    // this.clear_sale_location = function() {
    //     this.CI.session.unset_userdata('sale_location');
    // };
    // this.set_giftcard_remainder = function(value) {
    //     this.CI.session.set_userdata('giftcard_remainder', value);
    // };
    // this.get_giftcard_remainder = function() {
    //     return this.CI.session.userdata('giftcard_remainder');
    // };
    // this.clear_giftcard_remainder = function() {
    //     this.CI.session.unset_userdata('giftcard_remainder');
    // };

    // this.get_item_id = function(line_to_get) {
    //     var items;
    //     items = this.get_cart();
    //     var line;
    //     for (line in items) {
    //         var item;
    //         item = items[line];
    //         if (line == line_to_get) {
    //             return item['item_id'];
    //         }
    //     }
    //     return -1;
    // };
    // this.edit_item = function(line, description, serialnumber, quantity, discount, price, loyalty4item, amt4loyalty) {
    //     var items;
    //     items = this.get_cart();
    //     if (isset(items[line])) {
    //         line = & items[line];
    //         line['description'] = description;
    //         line['serialnumber'] = serialnumber;
    //         line['quantity'] = quantity;
    //         line['discount'] = discount;
    //         line['price'] = price;
    //         line['total'] = this.get_item_total(quantity, price, discount);
    //         line['discounted_total'] = this.get_item_total(quantity, price, discount, true);
    //         line['discounted_price'] = this.get_item_discount(quantity, price, discount);
    //         line['loyalty4item'] = loyalty4item;
    //         line['amt4loyalty'] = amt4loyalty;
    //         this.set_cart(items);
    //     }
    //     return false;
    // };

    // this.addItemKit = function(external_item_kit_id, item_location) {
    //     //KIT #
    //     var pieces;
    //     pieces = explode(' ', external_item_kit_id);
    //     var item_kit_id;
    //     item_kit_id = pieces[1];
    //     var _key_;
    //     for (_key_ in this.CI.Item_kit_items.get_info(item_kit_id)) {
    //         var item_kit_item;
    //         item_kit_item = this.CI.Item_kit_items.get_info(item_kit_id)[_key_];
    //         this.addItemToCart(item_kit_item['item_id'], item_kit_item['quantity'], item_location);
    //     }
    // };
    // this.copy_entire_sale = function(sale_id) {
    //     this.emptyCart();
    //     this.removeCustomer();
    //     var _key_;
    //     for (_key_ in this.CI.Sale.get_sale_items(sale_id).result()) {
    //         var row;
    //         row = this.CI.Sale.get_sale_items(sale_id).result()[_key_];
    //         this.addItemToCart(row.item_id, row.quantity_purchased, row.item_location, row.discount_percent, row.item_unit_price, row.description, row.serialnumber);
    //     }
    //     for (_key_ in this.CI.Sale.get_sale_payments(sale_id).result()) {
    //         row = this.CI.Sale.get_sale_payments(sale_id).result()[_key_];
    //         this.add_payment(row.payment_type, row.payment_amount);
    //     }
    //     this.set_customer(this.CI.Sale.get_customer(sale_id).person_id);
    // };
    // this.copyEntireKots4ThisOrder = function(sale_id) {
    //     var _key_;
    //     for (_key_ in this.CI.Sale_suspended.get_sale_items(sale_id).result()) {
    //         var row;
    //         row = this.CI.Sale_suspended.get_sale_items(sale_id).result()[_key_];
    //         this.addItemToCart(row.item_id, row.quantity_purchased, row.item_location, row.discount_percent, row.item_unit_price, row.description, row.serialnumber);
    //     }
    //     //TODO BK/Anup following code should be added/removed/modified later
    //     /*foreach($this->CI->Sale_suspended->get_sale_payments($sale_id)->result() as $row)
    //      {
    //          $this->add_payment($row->payment_type,$row->payment_amount);
    //      }
    //      */
    //     var suspended_sale_info;
    //     suspended_sale_info = this.CI.Sale_suspended.get_info(sale_id).row();
    //     //Add this person only if this is not empty or Null
    //     if (suspended_sale_info.person_id == null) {
    //         return false;
    //     } else {
    //         this.set_customer(suspended_sale_info.person_id);
    //     }
    //     //$this->set_comment($suspended_sale_info->comment);
    //     //$this->set_invoice_number($suspended_sale_info->invoice_number);
    // };
    // this.copy_entire_suspended_sale = function(sale_id) {
    //     this.emptyCart();
    //     this.removeCustomer();
    //     var _key_;
    //     for (_key_ in this.CI.Sale_suspended.get_sale_items(sale_id).result()) {
    //         var row;
    //         row = this.CI.Sale_suspended.get_sale_items(sale_id).result()[_key_];
    //         this.addItemToCart(row.item_id, row.quantity_purchased, row.item_location, row.discount_percent, row.item_unit_price, row.description, row.serialnumber);
    //     }
    //     for (_key_ in this.CI.Sale_suspended.get_sale_payments(sale_id).result()) {
    //         row = this.CI.Sale_suspended.get_sale_payments(sale_id).result()[_key_];
    //         this.add_payment(row.payment_type, row.payment_amount);
    //     }
    //     var suspended_sale_info;
    //     suspended_sale_info = this.CI.Sale_suspended.get_info(sale_id).row();
    //     this.set_customer(suspended_sale_info.person_id);
    //     this.set_comment(suspended_sale_info.comment);
    //     this.set_invoice_number(suspended_sale_info.invoice_number);
    // };
    // this.copy_entire_suspended_sale4kot = function(sale_id) {
    //     this.emptyCart();
    //     this.removeCustomer();
    //     var _key_;
    //     for (_key_ in this.CI.Sale_suspended.get_sale_items(sale_id).result()) {
    //         var row;
    //         row = this.CI.Sale_suspended.get_sale_items(sale_id).result()[_key_];
    //         this.addItemToCart(row.item_id, row.quantity_purchased, row.item_location, row.discount_percent, row.item_unit_price, row.description, row.serialnumber);
    //     }
    //     for (_key_ in this.CI.Sale_suspended.get_sale_payments(sale_id).result()) {
    //         row = this.CI.Sale_suspended.get_sale_payments(sale_id).result()[_key_];
    //         this.add_payment(row.payment_type, row.payment_amount);
    //     }
    //     var suspended_sale_info;
    //     suspended_sale_info = this.CI.Sale_suspended.get_info(sale_id).row();
    //     // $this->set_customer($suspended_sale_info->person_id);
    //     // $this->set_comment($suspended_sale_info->comment);
    //     // $this->set_invoice_number($suspended_sale_info->invoice_number);
    // };
    // this.copy_entire_suspended_Delivery = function(sale_id) {
    //     this.emptyCart();
    //     this.removeCustomer();
    //     var _key_;
    //     for (_key_ in this.CI.Sale_suspended.get_sale_items(sale_id).result()) {
    //         var row;
    //         row = this.CI.Sale_suspended.get_sale_items(sale_id).result()[_key_];
    //         this.addItemToCart(row.item_id, row.quantity_purchased, row.item_location, row.discount_percent, row.item_unit_price, row.description, row.serialnumber);
    //     }
    //     for (_key_ in this.CI.Sale_suspended.get_sale_payments(sale_id).result()) {
    //         row = this.CI.Sale_suspended.get_sale_payments(sale_id).result()[_key_];
    //         this.add_payment(row.payment_type, row.payment_amount);
    //     }
    //     var suspended_sale_info;
    //     suspended_sale_info = this.CI.Sale_suspended.get_info(sale_id).row();
    //     this.set_customer(suspended_sale_info.person_id);
    //     this.set_comment(suspended_sale_info.comment);
    //     this.set_invoice_number(suspended_sale_info.invoice_number);
    // };
    // this.delete_item = function(line) {
    //     var items;
    //     items = this.get_cart();
    //     delete items[line];
    //     this.set_cart(items);
    // };

    // this.clear_mode = function() {
    //     this.CI.session.unset_userdata('sale_mode');
    // };
    // this.clear_all = function() {
    //     this.clear_mode();
    //     this.emptyCart();
    //     this.clear_comment();
    //     this.clear_email_receipt();
    //     this.clear_invoice_number();
    //     this.clear_giftcard_remainder();
    //     this.empty_payments();
    //     this.removeCustomer();
    // };



    // this.validate_item = function(item_id) {
    //     //make sure item exists
    //     if (!this.CI.Item.exists(item_id)) {
    //         //try to get item id given an item_number
    //         var mode;
    //         mode = this.get_mode();
    //         item_id = this.CI.Item.get_item_id(item_id);
    //         if (!item_id) {
    //             return false;
    //         }
    //     }
    //     return true;
    // };

    return this;
};