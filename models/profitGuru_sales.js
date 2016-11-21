/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var SalesModel = sequelize.define('profitGuru_sales', {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: false,

		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
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
		tableName: 'profitGuru_sales',
		classMethods: {
			associate: function(models) {

				SalesModel.belongsTo(models.profitGuru_employees, {
					foreignKey: 'employee_id',
					constraints: false
				});
				SalesModel.belongsTo(models.profitGuru_customers, {
					foreignKey: 'customer_id',
					constraints: false
				});

				SalesModel.hasMany(models.profitGuru_sales_items_taxes, {
					foreignKey: 'sale_id',
					constraints: false
				});
				SalesModel.hasMany(models.profitGuru_sales_items, {
					foreignKey: 'sale_id',
					constraints: false
				});
				SalesModel.hasMany(models.profitGuru_sales_payments, {
					foreignKey: 'sale_id',
					constraints: false
				});
			},
			isSaleExists: function(saleId) {
				return new Promise(function(resolve, reject) {
					return this.findById(saleId).then(function(sale) {
						if (!sale)
							resolve(false);
						else
							resolve(saleId);
					});
				});
			},
			getSaleIdFromInvoiceNumber: function(invoiceNumber) {
				return new Promise(function(resolve, reject) {
					this.findOne({
						where: {
							invoice_number: invoiceNumber
						}
					}).then(function(saleInfo) {
						if (!saleInfo) {
							resolve(false);
						} else {
							resolve(saleInfo[0].dataValues.sale_id);
						}
					});
				});
			}
		}
	});

	return SalesModel;
};