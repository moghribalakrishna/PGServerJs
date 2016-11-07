/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_permissions', {
		permission_id: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		module_id: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_modules',
				key: 'module_id'
			}
		},
		location_id: {
			type: DataTypes.INTEGER(10),
			allowNull: true,
			references: {
				model: 'profitGuru_stock_locations',
				key: 'location_id'
			}
		}
	}, {
		tableName: 'profitGuru_permissions'
	});
};
