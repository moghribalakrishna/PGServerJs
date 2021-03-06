/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	var suppliersModel = sequelize.define('profitGuru_suppliers', {

		person_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true, // I have created this as an primary key to avoid sequlize to cteare
			//extra id filed and also to use findById whenever needed , otherwise this woold have considered
			//id field created by default
			references: {
				model: 'profitGuru_people',
				key: 'person_id'
			}
		},
		company_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		agency_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		account_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
		deleted: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: true,

		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
		tableName: 'profitGuru_suppliers',
		classMethods: {
			associate: function(models) {

				suppliersModel.hasMany(models.profitGuru_items, {
					as: 'Supplier',
					foreignKey: 'supplier_id',
					constraints: false
				});

				suppliersModel.hasMany(models.profitGuru_receivings, {
					foreignKey: 'supplier_id',
					constraints: false
				});
			},
			validate: {
				isPersonExistsWithThisPhoneNumber: function(phoneNumber) {
					//var defered = q.defer();
					this.findAndCountAll({
						where: {
							phone_number: phoneNumber
						}
					}).then(function(result) {
						//defered.resolve(result.count > 0);
						if (result.count > 0) {
							throw new Error('Person with phoneNumber=' + phoneNumber + 'already Exists');
						}
					}).catch(function(reason) {
						throw new Error(reason);
					});
					//return defered.promise;
				}
			}
		}
	});
	return suppliersModel;
};