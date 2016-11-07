/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_licenceAuth', {
		clientId: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		clientType: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		enlicence: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		validity: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		local_txn_time: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		}
	}, {
		tableName: 'profitGuru_licenceAuth'
	});
};
