/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var DiscountModel = sequelize.define('profitGuru_discounts', {
		item_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		discount: {
			type: 'REAL',
			allowNull: false,
			defaultValue: undefined,
			validate: {
				isDecimal: true
			}
		},
		loyaltyPerc: {
			type: 'REAL',
			allowNull: false,
			defaultValue: undefined,
			validate: {
				isDecimal: true,
			}
		},
		discout_expiry: {
			validate: {
				isDate: {
					msg: "Discount expiry_date Must be Valid Date"
				} //,
				// isInputIsNullString: function(value) {
				// 	if (value === '')
				// 		this.expiry_date = null;
				// }
			},
			type: DataTypes.TIME,
			allowNull: true,
			defaultValue: null
		},
		itemNprice: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_discounts',
		classMethods: {
			associate: function(models) {

				DiscountModel.belongsTo(models.profitGuru_items, {
					foreignKey: 'item_id',
					constraints: false
				});

			}
		}
	});

	return DiscountModel;
};