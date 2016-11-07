/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_tables_details', {
		table_no: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		desc: {
			type: DataTypes.TEXT,
			allowNull: true,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_tables_details'
	});
};
