/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_sessions', {
		id: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0',
			primaryKey: true
		},
		ip_address: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0'
		},
		data: {
			type: 'blob',
			allowNull: false,
			defaultValue: undefined
		},
		timestamp: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_sessions'
	});
};
