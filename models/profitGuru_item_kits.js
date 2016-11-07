/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_item_kits', {
		item_kit_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_item_kits'
	});
};
