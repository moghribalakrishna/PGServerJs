/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_grants', {
		permission_id: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_permissions',
				key: 'permission_id'
			}
		},
		person_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			references: {
				model: 'profitGuru_employees',
				key: 'person_id'
			}
		}
	}, {
		tableName: 'profitGuru_grants'
	});
};
