/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var SuspendedSalesPaymentsModel = sequelize.define('profitGuru_sales_suspended_payments', {
		sale_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_sales_suspended',
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
		tableName: 'profitGuru_sales_suspended_payments',
		classMethods: {
			associate: function(models) {

				SuspendedSalesPaymentsModel.belongsTo(models.profitGuru_sales_suspended, {
					foreignKey: 'sale_id',
					constraints: false
				});
			}
		}
	});

	return SuspendedSalesPaymentsModel;
};