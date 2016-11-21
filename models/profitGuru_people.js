/* jshint indent: 1 */
var q = require('q');
module.exports = function(sequelize, DataTypes) {
	var peopleModel = sequelize.define('profitGuru_people', {

		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		gender: {
			type: DataTypes.INTEGER(1),
			allowNull: true
		},
		phone_number: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined,
			unique: true
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		address_1: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		address_2: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		city: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		state: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		zip: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		country: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		comments: {
			type: DataTypes.TEXT,
			allowNull: false,
			defaultValue: undefined
		},
		person_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			//defaultValue: undefined,
			primaryKey: true
		}
	}, {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: true,

		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
		//unused field
		tableName: 'profitGuru_people',
		classMethods: {
			associate: function(models) {

				peopleModel.hasMany(models.profitGuru_customers, {
					foreignKey: 'person_id',
					constraints: false
				});
				peopleModel.hasMany(models.profitGuru_employees, {
					foreignKey: 'person_id',
					constraints: false
				});
				peopleModel.hasMany(models.profitGuru_suppliers, {
					foreignKey: 'person_id',
					constraints: false
				});

			},
			isPersonExistsWithThisPhoneNumber: function(phoneNumber) {
				var defered = q.defer();
				this.findAndCountAll({
					where: {
						phone_number: phoneNumber
					}
				}).then(function(result) {
					defered.resolve(result);
				}).catch(function(reason) {
					defered.reject(reason);
				});
				return defered.promise;
			}
		}
	});
	return peopleModel;
};