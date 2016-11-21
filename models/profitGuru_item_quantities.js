/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var ItemQuantitiesTable = sequelize.define('profitGuru_item_quantities', {
		item_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			primaryKey: true,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_items',
				key: 'item_id',

			}
		},
		location_id: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true,
			validate: {
				isNumeric: {
					msg: "looks suspecious location_id"
				}
			},
			references: {
				model: 'profitGuru_stock_locations',
				key: 'location_id'
			}
		},
		quantity: {
			validate: {
				isNumeric: {
					msg: "looks suspecious quantity value, must be Numeric"
				}
			},
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_item_quantities',
		classMethods: {
			associate: function(models) {
				ItemQuantitiesTable.belongsTo(models.profitGuru_items, {
					foreignKey: 'item_id',
					constraints: false
				});
				ItemQuantitiesTable.belongsTo(models.profitGuru_stock_locations, {
					foreignKey: 'location_id',
					constraints: false
				});

			}
		}
	});
	return ItemQuantitiesTable;
};