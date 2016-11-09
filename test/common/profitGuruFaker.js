var faker = require('faker');

var profitGuruFakerElementsData = function() {

	// Works fine for Items
	this.getFakerItem = function(itemType, appType) {
		var item = {};
		if (itemType == "Prepared" && appType == "restaurant") {
			item = {
				"item_id": "",
				"name": faker.commerce.productName(),
				"item_number": faker.random.number(),
				"cost_price": faker.random.number(),
				"unit_price": faker.random.number(),
				"1_quantity": "",
				"category": faker.lorem.word(),
				"supplier_id": null,
				"item_image": "",
				"is_serialized": "0",
				"is_deleted": "0",
				"itemNprice": "0",
				"expiry": "",
				"allow_alt_description": "0",
				"ItemType": "Prepared",
				"custom1": 0,
				"custom2": 0,
				"custom3": 0,
				"custom4": 0,
				"custom5": 0,
				"custom6": 0,
				"custom7": 0,
				"custom8": 0,
				"custom9": 0,
				"custom10": 0,
				"isprepared": true,
				"issellable": true,
				"isbought": false
			};
		} else if (itemType == "Ingrediant" && appType == "restaurant") {
			item = {
				"item_id": "",
				"name": faker.commerce.productName(),
				"item_number": faker.random.number(),
				"cost_price": faker.random.number(),
				"unit_price": faker.random.number(),
				"1_quantity": "",
				"category": faker.lorem.word(),
				"supplier_id": "",
				"item_image": "",
				"is_serialized": "0",
				"is_deleted": "0",
				"itemNprice": "0",
				"expiry": "",
				"allow_alt_description": "0",
				"ItemType": "Prepared",
				"custom1": 0,
				"custom2": 0,
				"custom3": 0,
				"custom4": 0,
				"custom5": 0,
				"custom6": 0,
				"custom7": 0,
				"custom8": 0,
				"custom9": 0,
				"custom10": 0,
				"isprepared": false,
				"issellable": false,
				"isbought": true
			};
		} else if (itemType == "FastFood" && appType == "restaurant") {
			item = {
				"item_id": "",
				"name": faker.commerce.productName(),
				"item_number": faker.random.number(),
				"cost_price": faker.random.number(),
				"unit_price": faker.random.number(),
				"1_quantity": "",
				"category": faker.lorem.word(),
				"supplier_id": "",
				"item_image": "",
				"is_serialized": "0",
				"is_deleted": "0",
				"itemNprice": "0",
				"expiry": "",
				"allow_alt_description": "0",
				"ItemType": "Prepared",
				"custom1": 0,
				"custom2": 0,
				"custom3": 0,
				"custom4": 0,
				"custom5": 0,
				"custom6": 0,
				"custom7": 0,
				"custom8": 0,
				"custom9": 0,
				"custom10": 0,
				"isprepared": false,
				"issellable": true,
				"isbought": true
			};
		} else {
			item = {
				"item_id": "",
				"name": faker.commerce.productName(),
				"item_number": faker.random.number(),
				"cost_price": faker.random.number(),
				"unit_price": faker.random.number(),
				"1_quantity": "",
				"category": faker.lorem.word(),
				"supplier_id": "",
				"item_image": "",
				"is_serialized": "0",
				"is_deleted": "0",
				"itemNprice": "0",
				"expiry": "",
				"allow_alt_description": "0",
				"ItemType": "Prepared",
				"custom1": 0,
				"custom2": 0,
				"custom3": 0,
				"custom4": 0,
				"custom5": 0,
				"custom6": 0,
				"custom7": 0,
				"custom8": 0,
				"custom9": 0,
				"custom10": 0,
				"isprepared": false,
				"issellable": false,
				"isbought": false
			};
		}

		item.reorder_level = faker.random.number({
			min: 0,
			max: 2000
		});
		item.quantity = faker.random.number({
			min: 0,
			max: 10000
		});
		item.receiving_quantity = faker.random.number({
			min: 0,
			max: 10000
		});
		item.loyaltyPerc = faker.finance.amount(0, 10, 2);
		item.tax_name_1 = "VAT";
		item.tax_name_2 = "GST";
		item.tax_percent_1 = faker.random.arrayElement([0, 5.5, 12]);
		item.tax_percent_2 = faker.random.arrayElement([0, 6.5, 18]);
		item.description = faker.lorem.word();
		item.discount = faker.finance.amount(0, 70, 2);

		return item;
	};
	this.getFakerCustomer = function() {
		return {
			"person_id": "",
			"first_name": faker.name.firstName(),
			"last_name": faker.name.lastName(),
			"gender": "M",
			"email": faker.internet.email(),
			"phone_number": faker.phone.phoneNumber(),
			"address_1": faker.address.streetName(),
			"address_2": faker.address.streetAddress(),
			"city": faker.address.city(),
			"state": faker.address.state(),
			"zip": faker.address.zipCode(),
			"country": faker.address.country(),
			"comments": "",
			"account_number": faker.random.number(), //"",
			"company_name": faker.company.companyName(),
			"taxable": 0,
			"loyalty": 0
		};
	};

	this.getFakerEmployee = function() {
		var firstName = faker.name.firstName();
		return {
			"person_id": "",
			"username": firstName,
			"password": firstName,
			"password_again": firstName,
			"first_name": firstName,
			"last_name": faker.name.lastName(),
			"gender": "",
			"email": faker.internet.email(),
			"phone_number": faker.phone.phoneNumber(),
			"address_1": faker.address.streetName(),
			"address_2": faker.address.streetAddress(),
			"city": faker.address.city(),
			"state": faker.address.state(),
			"zip": faker.address.zipCode(),
			"country": faker.address.country(),
			"comments": ""
		};
	};

	this.getFakerSupplier = function() {
		return {
			"person_id": "",
			"company_name": faker.company.companyName(),
			"agency_name": faker.company.companyName(),
			"first_name": faker.name.firstName(),
			"last_name": faker.name.lastName(),
			"gender": "",
			"email": faker.internet.email(),
			"phone_number": faker.phone.phoneNumber(),
			"address_1": faker.address.streetName(),
			"address_2": faker.address.streetAddress(),
			"city": faker.address.city(),
			"state": faker.address.state(),
			"zip": faker.address.zipCode(),
			"country": faker.address.country(),
			"comments": "",
			"account_number": faker.finance.account()
		};
	};

};

module.exports = new profitGuruFakerElementsData();