/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_sales_payments', {
		sale_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_sales',
				key: 'sale_id'
			}
		},
		payment_type: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		payment_amount: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_sales_payments'
	});
};
