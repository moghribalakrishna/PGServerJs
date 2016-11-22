/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var IneventoryModel = sequelize.define('profitGuru_inventory', {
		trans_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true,
			autoIncrement: true
		},
		trans_items: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			references: {
				model: 'profitGuru_items',
				key: 'item_id'
			}
		},
		trans_user: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0',
			references: {
				model: 'profitGuru_employees',
				key: 'person_id'
			}
		},
		trans_date: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		trans_comment: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: undefined
		},
		trans_location: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_stock_locations',
				key: 'location_id'
			}
		},
		trans_inventory: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_inventory',
		classMethods: {
			associate: function(models) {

				IneventoryModel.belongsTo(models.profitGuru_items, {
					as: 'inventories',
					foreignKey: 'trans_items',
					constraints: false
				});
				IneventoryModel.belongsTo(models.profitGuru_inventory, {
					foreignKey: 'trans_user',
					constraints: false
				});
				IneventoryModel.belongsTo(models.profitGuru_stock_locations, {
					foreignKey: 'trans_location',
					constraints: false
				});

			}
		}
	});
	return IneventoryModel;
};