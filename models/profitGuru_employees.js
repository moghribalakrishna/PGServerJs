/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var EmployeesModel = sequelize.define('profitGuru_employees', {
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
			primaryKey: true,
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
		tableName: 'profitGuru_employees',
		classMethods: {
			associate: function(models) {

				EmployeesModel.hasMany(models.profitGuru_inventory, {
					foreignKey: 'trans_user',
					constraints: false
				});
				EmployeesModel.hasMany(models.profitGuru_receivings, {
					foreignKey: 'employee_id',
					constraints: false
				});
				EmployeesModel.hasMany(models.profitGuru_sales, {
					foreignKey: 'employee_id',
					constraints: false
				});
				EmployeesModel.hasMany(models.profitGuru_sales_suspended, {
					foreignKey: 'employee_id',
					constraints: false
				});

				EmployeesModel.belongsTo(models.profitGuru_people, {
					foreignKey: 'person_id',
					constraints: true
				});

			}
		}
	});
	return EmployeesModel;
};