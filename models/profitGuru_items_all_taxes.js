/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_items_all_taxes', {
		item_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		tax1_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		tax1_percent: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		},
		tax2_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		tax2_percent: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_items_all_taxes'
	});
};
