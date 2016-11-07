/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_giftcards', {
		record_time: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		giftcard_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			defaultValue: undefined,
			primaryKey: true
		},
		giftcard_number: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		},
		value: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		},
		deleted: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		person_id: {
			type: DataTypes.INTEGER(10),
			allowNull: true,
			references: {
				model: 'profitGuru_people',
				key: 'person_id'
			}
		}
	}, {
		tableName: 'profitGuru_giftcards'
	});
};
