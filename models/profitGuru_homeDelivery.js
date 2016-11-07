/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_homeDelivery', {
		delivery_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		sale_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		},
		person_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_homeDelivery'
	});
};
