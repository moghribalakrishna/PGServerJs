/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_receivings_items', {

		receiving_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: '0',
			references: {
				model: 'profitGuru_receivings',
				key: 'receiving_id'
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
			defaultValue: undefined
		},
		quantity_purchased: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: '0'
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
			defaultValue: undefined
		},
		receiving_quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1'
		}
	}, {
		tableName: 'profitGuru_receivings_items'
	});
};