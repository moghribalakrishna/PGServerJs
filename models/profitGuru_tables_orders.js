/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_tables_orders', {
		table_no: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		guests: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: '1'
		},
		order_no: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		},
		order_desc: {
			type: DataTypes.STRING,
			allowNull: true,
			defaultValue: undefined
		},
		reservation_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_tables_orders'
	});
};
