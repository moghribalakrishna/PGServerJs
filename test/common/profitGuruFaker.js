var faker = require('faker');
//var chance = require('chance');
var profitGuruFakerElementsData = function() {

	this.getFakerSession = function() {
		return {
			sale_mode: 'sale',
			location_id: 1
		};
	};

	this.getFakerItem = function(itemType, appType) {
		/*	TODO changes to Items with Node BackEnd
	
		1) expiry is now getting added directly to items
		2) made arrangements to add expiry to discounts
		3) removed custom fields
		4) renamed input field 1_quantity to quantity
		5) created new input field location_id at the backend , user can select from the
			available locations
		6) Converted hardcoded taxnames and taxpercent rather to take array inputs
		*/

		var item = {};
		if (itemType == "Prepared" && appType == "restaurant") {
			item = {
				"item_id": "",
				"name": faker.commerce.productName(),
				"item_number": faker.random.number(),
				"cost_price": faker.random.number(),
				"unit_price": faker.random.number(),
				"quantity": "",
				"category": faker.lorem.word(),
				"supplier_id": null,
				"item_image": "",
				"is_serialized": "0",
				"is_deleted": "0",
				"itemNprice": "0",
				"expiry_date": "",
				"allow_alt_description": "0",
				"ItemType": "Prepared",
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
				"quantity": "",
				"category": faker.lorem.word(),
				"supplier_id": null,
				"item_image": "",
				"is_serialized": "0",
				"is_deleted": "0",
				"itemNprice": "0",
				"expiry_date": "",
				"allow_alt_description": "0",
				"ItemType": "Prepared",
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
				"quantity": "",
				"category": faker.lorem.word(),
				"supplier_id": null,
				"item_image": "",
				"is_serialized": "0",
				"is_deleted": "0",
				"itemNprice": "0",
				"expiry_date": "",
				"allow_alt_description": "0",
				"ItemType": "Prepared",
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
				"quantity": "",
				"category": faker.lorem.word(),
				"supplier_id": null,
				"item_image": "",
				"is_serialized": "0",
				"is_deleted": "0",
				//"itemNprice": "0",
				//"expiry_date": "",
				"allow_alt_description": "0",
				"ItemType": "Prepared",
				"isprepared": false,
				"issellable": false,
				"isbought": false
			};
		}

		if (!item.expiry_date)
			item.expiry_date = faker.date.future();

		if (!item.discount_expiry)
			item.discount_expiry = faker.date.future();

		if (!item.itemNprice)
			item.itemNprice = faker.random.boolean();
		item.location_id = 1;
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
		item.tax_names = ["VAT", "GST"];
		item.tax_percents = [faker.random.arrayElement([0, 5.5, 12]), faker.random.arrayElement([0, 6.5, 18])];
		item.description = faker.lorem.word();
		item.discount = faker.finance.amount(0, 70, 2);

		return item;
	};

	this.getPersonData = function() {
		return {
			"person_id": "",
			"first_name": faker.name.firstName(),
			"last_name": faker.name.lastName(),
			"gender": faker.random.arrayElement(['M', 'F']),
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

	this.getFakerCustomer = function() {
		return {
			"person_id": "",
			"first_name": faker.name.firstName(),
			"last_name": faker.name.lastName(),
			"gender": faker.random.arrayElement(['M', 'F']),
			"email": faker.internet.email(),
			"phone_number": faker.phone.phoneNumber(),
			"address_1": faker.address.streetName(),
			"address_2": faker.address.streetAddress(),
			"city": faker.address.city(),
			"state": faker.address.state(),
			"zip": faker.address.zipCode(),
			"country": faker.address.country(),
			"comments": "",
			"account_number": (faker.random.number()).toString(), //"",
			"company_name": faker.company.companyName(),
			"taxable": faker.random.arrayElement([0, 1]),
			"loyalty": faker.random.arrayElement([0, 1])
		};
	};

	this.getFakerPerson = function() {
		return {
			"first_name": faker.name.firstName(),
			"last_name": faker.name.lastName(),
			"gender": faker.random.arrayElement(['M', 'F']),
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

	this.getFakerCustomerConfig = function() {
		return {
			"account_number": (faker.random.number()).toString(), //"",
			"company_name": faker.company.companyName(),
			"taxable": faker.random.arrayElement([0, 1]),
			"loyalty": faker.random.arrayElement([0, 1])
		};
	};
	this.getFakerStockLoaction = function() {
		return {
			location_id: 1,
			location_name: faker.company.companyName()
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

	this.getFakerGiftcard = function() {
		return {
			giftcardvalue: (faker.random.number({
				min: 0,
				max: 20
			})) * 500
		};
	};

};

module.exports = new profitGuruFakerElementsData();