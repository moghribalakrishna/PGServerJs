/* jshint indent: 1 */
//var Promise = require('bluebird');
module.exports = function(sequelize, DataTypes) {
	var ItemKitsModel = sequelize.define('profitGuru_item_kits', {
		item_kit_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_item_kits',
		classMethods: {
			associate: function(models) {
				ItemKitsModel.hasMany(models.profitGuru_item_kit_items, {
					foreignKey: 'item_kit_id',
					constraints: false
				});

			},
			isItemKitExists: function(itemKitId) {
				return new Promise(function(resolve, reject) {
					return this.findById(itemKitId).then(function(itemKit) {
						if (!itemKit)
							resolve(false);
						else
							resolve(true);
					});
				});
			}
		}
	});

	return ItemKitsModel;
};