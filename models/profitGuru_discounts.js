/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_discounts', {
		item_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		discount: {
			type: 'REAL',
			allowNull: false,
			defaultValue: undefined
		},
		loyaltyPerc: {
			type: 'REAL',
			allowNull: false,
			defaultValue: undefined
		},
		expiry_date: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		itemNprice: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_discounts'
	});
};
