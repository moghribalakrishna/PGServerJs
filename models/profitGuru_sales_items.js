/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_sales_items', {
		sale_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: '0',
			references: {
				model: 'profitGuru_sales',
				key: 'sale_id'
			}
		},
		item_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: '0',
			references: {
				model: 'profitGuru_items',
				key: 'item_id'
			}
		},
		description: {
			type: DataTypes.STRING,
			allowNull: true
		},
		serialnumber: {
			type: DataTypes.STRING,
			allowNull: true
		},
		line: {
			type: DataTypes.INTEGER(3),
			allowNull: false,
			defaultValue: '0'
		},
		quantity_purchased: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: '0.00'
		},
		item_cost_price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		},
		item_unit_price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		},
		discount_percent: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: '0'
		},
		item_location: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_stock_locations',
				key: 'location_id'
			}
		}
	}, {
		tableName: 'profitGuru_sales_items'
	});
};
