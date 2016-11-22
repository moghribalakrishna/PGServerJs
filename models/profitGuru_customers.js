/* jshint indent: 1 */

//TODO Custmers now Made to own giftcards rather than persons table
module.exports = function(sequelize, DataTypes) {
	"use strict";
	var customersModel = sequelize.define('profitGuru_customers', {
		person_id: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
			/*references: {
				model: 'profitGuru_people',
				key: 'person_id'
			}*/
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
		loyalty: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		}
	}, {

		timestamps: true,
		paranoid: true,
		tableName: 'profitGuru_customers',
		classMethods: {
			associate: function(models) {

				customersModel.belongsTo(models.profitGuru_people, {
					foreignKey: 'person_id',
					constraints: true
				});
				customersModel.hasMany(models.profitGuru_sales, {
					foreignKey: 'customer_id',
					constraints: false
				});
				customersModel.hasMany(models.profitGuru_sales_suspended, {
					foreignKey: 'customer_id',
					constraints: false
				});

				customersModel.hasMany(models.profitGuru_giftcards, {
					foreignKey: 'customer_id',
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

	return customersModel;
};