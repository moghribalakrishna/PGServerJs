/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_app_config', {
		key: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		value: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_app_config'
	});
};
