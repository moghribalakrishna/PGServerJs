/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_sales_suspended', {
		sale_time: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		customer_id: {
			type: DataTypes.INTEGER(10),
			allowNull: true,
			references: {
				model: 'profitGuru_customers',
				key: 'person_id'
			}
		},
		employee_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: '0',
			references: {
				model: 'profitGuru_employees',
				key: 'person_id'
			}
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: undefined
		},
		invoice_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
		sale_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		}
	}, {
		tableName: 'profitGuru_sales_suspended'
	});
};
