/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_table_reservation', {
		reservation_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		},
		table_no: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		},
		booking_call_time: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		book_time: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: undefined
		},
		booking_end_time: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: undefined
		},
		customer_contact_info: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		employee: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		Description: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		tableName: 'profitGuru_table_reservation'
	});
};
