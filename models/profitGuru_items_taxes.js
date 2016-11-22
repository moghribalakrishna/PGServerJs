/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {

	var ItemTaxesModel = sequelize.define('profitGuru_items_taxes', {
		item_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true,
			references: {
				model: 'profitGuru_items',
				key: 'item_id'
			}
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		percent: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_items_taxes',
		classMethods: {
			associate: function(models) {
				ItemTaxesModel.belongsTo(models.profitGuru_items, {
					as: 'taxes',
					foreignKey: 'item_id',
					constraints: false
				});

			}
		}
	});

	return ItemTaxesModel;
};