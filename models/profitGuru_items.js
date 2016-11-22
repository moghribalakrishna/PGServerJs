/* jshint indent: 1 */

var q = require('q');
var merge = require('merge');

module.exports = function(sequelize, DataTypes) {
	var itemsModel = sequelize.define('profitGuru_items', {

		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},

		category: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		supplier_id: {
			type: DataTypes.INTEGER(11),
			allowNull: true,
			references: {
				model: 'profitGuru_suppliers',
				key: 'person_id',
				allowNull: true,

			}
		},
		item_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		cost_price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		},
		unit_price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		},
		reorder_level: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: '0'
		},
		receiving_quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1'
		},
		item_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		pic_id: {
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		allow_alt_description: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: undefined
		},
		is_serialized: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: undefined
		},
		isprepared: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0'
		},
		issellable: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0'
		},
		isbought: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0'
		},
		deleted: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		expiry_date: {
			validate: {
				isDate: {
					msg: "Item expiry_date Must be Valid Date"
				}
			},
			type: DataTypes.TIME,
			allowNull: true,
			defaultValue: null
		},
	}, {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: true,
		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
		tableName: 'profitGuru_items',
		classMethods: {
			associate: function(models) {

				itemsModel.belongsTo(models.profitGuru_suppliers, {
					foreignKey: 'supplier_id',
					as: 'Supplier',
					constraints: false
				});
				itemsModel.hasMany(models.profitGuru_inventory, {
					//	as: 'inventories',
					foreignKey: 'trans_items',
					constraints: false
				});
				itemsModel.hasOne(models.profitGuru_discounts, {
					as: 'Discounts',
					foreignKey: 'item_id',
					constraints: false
				});
				itemsModel.hasOne(models.profitGuru_item_quantities, {
					as: 'Quantity',
					foreignKey: 'item_id',
					constraints: false
				});
				itemsModel.hasMany(models.profitGuru_items_taxes, {
					as: 'taxes',
					foreignKey: 'item_id',
					constraints: false
				});
				itemsModel.hasMany(models.profitGuru_item_kit_items, {
					foreignKey: 'item_id',
					constraints: false
				});

				// itemsModel.hasOne(models.profitGuru_stock_locations, {
				// 	foreignKey: 'item_id',
				// 	constraints: false
				// });
				itemsModel.hasMany(models.profitGuru_sales_items, {
					foreignKey: 'item_id',
					constraints: false
				});
				itemsModel.hasMany(models.profitGuru_sales_items_taxes, {
					foreignKey: 'item_id',
					constraints: false
				});

				itemsModel.hasMany(models.profitGuru_sales_suspended_items, {
					foreignKey: 'item_id',
					constraints: false
				});

				itemsModel.hasMany(models.profitGuru_sales_suspended_items_taxes, {
					foreignKey: 'item_id',
					constraints: false
				});

			},
			isItemExists: function(itemNumber, itemName) {

				var defered = q.defer();
				this.findAndCountAll({

					where: {
						deletedAt: {
							$eq: null
						},
						item_number: itemNumber,
						name: itemName
					}
				}).then(function(result) {
					defered.resolve(result.count > 0);
				}).catch(function(reason) {
					defered.reject(reason);
				});
				return defered.promise;
			},
			isItemExistsByItemId: function(itemId) {
				var _self = this;
				return new Promise(function(resolve, reject) {
					this.findAndCountAll({
						where: {
							item_id: itemId
						}
					}).then(function(result) {
						if (result.count === 1) {
							resolve(true);
						} else if (result.count > 1) {
							reject(' Wiered there are ' + result.count + ' Items with itemId=' + itemId);
						} else {
							resolve(false);
						}
					});
				});
			}
		}

	});

	itemsModel.getThisItemInfo = function(itemId) {
		var _self = this;
		var Models = require('./index.js');
		var result = {};
		return new Promise(function(resolve, reject) {

			_self.find({

				include: [{
					model: Models.profitGuru_suppliers,
					as: 'Supplier',
					attributes: ['company_name', 'account_number', 'agency_name']
				}, {
					model: Models.profitGuru_discounts,
					as: 'Discounts',
					attributes: ['discount', 'loyaltyPerc', 'discout_expiry', 'itemNprice', ]
				}, {
					model: Models.profitGuru_item_quantities,
					as: 'Quantity',
					attributes: ['quantity'],
					include: [{
						model: Models.profitGuru_stock_locations,
						as: 'StockLocation',
						attributes: ['location_name'],
					}]
				}],
				where: {
					item_id: itemId
				}
			}).then(function(thisItemInfo) {
				//var itemsCompeleteInfo = {};
				// result = merge(thisItemInfo.dataValues, thisItemInfo.profitGuru_supplier.dataValues, thisItemInfo.profitGuru_discount.dataValues);
				// delete result.dataValues;
				// delete result.dataValues;
				//resolve(result);
				resolve(thisItemInfo.get({
					plain: true
				}));
			});
		});
	};

	return itemsModel;
};