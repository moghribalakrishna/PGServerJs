/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_customers', {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: false,

		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
		person_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_people',
				key: 'person_id'
			}
		},
		company_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		account_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
		taxable: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '1'
		},
		deleted: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		loyalty: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		tableName: 'profitGuru_customers'
	});
};