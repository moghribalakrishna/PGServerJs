/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var salesItemTaxesModel = sequelize.define('profitGuru_sales_items_taxes', {
		sale_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_sales_items',
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
		tableName: 'profitGuru_sales_items_taxes',
		classMethods: {
			associate: function(models) {

				salesItemTaxesModel.belongsTo(models.profitGuru_items, {
					foreignKey: 'item_id',
					constraints: false
				});

				salesItemTaxesModel.belongsTo(models.profitGuru_sales_items, {
					foreignKey: 'sale_id',
					constraints: false
				});
			}
		}
	});

	return salesItemTaxesModel;
};