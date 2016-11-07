/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_items_taxes', {
		item_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_items',
				key: 'item_id'
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		percent: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_items_taxes'
	});
};
