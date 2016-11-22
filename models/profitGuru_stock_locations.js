/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var StockLocation = sequelize.define('profitGuru_stock_locations', {
		location_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: undefined,
			primaryKey: true
		},
		location_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		deleted: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_stock_locations',
		classMethods: {
			associate: function(models) {

				StockLocation.hasMany(models.profitGuru_inventory, {
					foreignKey: 'trans_location',
					constraints: false
				});

				StockLocation.hasMany(models.profitGuru_sales_items, {
					foreignKey: 'item_location',
					constraints: false
				});

				StockLocation.hasMany(models.profitGuru_sales_suspended_items, {
					foreignKey: 'item_location',
					constraints: false
				});

				StockLocation.hasOne(models.profitGuru_item_quantities, {
					as: 'StockLocation',
					foreignKey: 'location_id',
					constraints: false
				});

			}
		}
	});

	return StockLocation;
};