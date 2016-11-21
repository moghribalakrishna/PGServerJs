/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var ItemKitItmesModel = sequelize.define('profitGuru_item_kit_items', {
		item_kit_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_item_kits',
				key: 'item_kit_id'
			}
		},
		item_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_items',
				key: 'item_id'
			}
		},
		quantity: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_item_kit_items',
		classMethods: {
			associate: function(models) {
				ItemKitItmesModel.belongsTo(models.profitGuru_items, {
					foreignKey: 'item_id',
					constraints: false
				});
				ItemKitItmesModel.belongsTo(models.profitGuru_item_kits, {
					foreignKey: 'item_kit_id',
					constraints: false
				});

			}
		}
	});

	return ItemKitItmesModel;
};