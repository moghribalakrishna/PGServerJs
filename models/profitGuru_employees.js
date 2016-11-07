/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_employees', {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: false,

		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		person_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_people',
				key: 'person_id'
			}
		},
		deleted: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_employees'
	});
};