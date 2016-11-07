/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_item_quantities', {
		item_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_items',
				key: 'item_id'
			}
		},
		location_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_stock_locations',
				key: 'location_id'
			}
		},
		quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_item_quantities'
	});
};
