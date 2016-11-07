/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_Notes', {
		user_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	}, {
		tableName: 'profitGuru_Notes'
	});
};