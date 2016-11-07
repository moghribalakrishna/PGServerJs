/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_tables_sales', {
		table_no: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		sale_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		},
		order_no: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_tables_sales'
	});
};
