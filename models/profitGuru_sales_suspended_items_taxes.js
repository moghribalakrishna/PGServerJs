/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var SuspendedSalesItemsTaxesModel = sequelize.define('profitGuru_sales_suspended_items_taxes', {
		sale_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_sales_suspended_items',
				key: 'sale_id'
			}
		},
		item_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_items',
				key: 'item_id'
			}
		},
		line: {
			type: DataTypes.INTEGER(3),
			allowNull: false,
			defaultValue: '0'
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		percent: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_sales_suspended_items_taxes',
		classMethods: {
			associate: function(models) {

				SuspendedSalesItemsTaxesModel.belongsTo(models.profitGuru_items, {
					foreignKey: 'item_id',
					constraints: false
				});

				SuspendedSalesItemsTaxesModel.belongsTo(models.profitGuru_sales_suspended_items, {
					foreignKey: 'sale_id',
					constraints: false
				});
			}
		}
	});

	return SuspendedSalesItemsTaxesModel;
};