/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_items', {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: false,

		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},

		category: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		// supplier_id: {
		// 	type: DataTypes.INTEGER(11),
		// 	allowNull: true,
		// 	references: {
		// 		model: 'profitGuru_suppliers',
		// 		key: 'person_id',
		// 		allowNull: true,

		// 	}
		// },
		item_number: {
			type: DataTypes.STRING,
			allowNull: true
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		cost_price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		},
		unit_price: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		},
		reorder_level: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: '0'
		},
		receiving_quantity: {
			type: DataTypes.INTEGER(11),
			allowNull: false,
			defaultValue: '1'
		},
		item_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		pic_id: {
			type: DataTypes.INTEGER(10),
			allowNull: true
		},
		allow_alt_description: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: undefined
		},
		is_serialized: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: undefined
		},
		isprepared: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0'
		},
		issellable: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0'
		},
		isbought: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: '0'
		},
		deleted: {
			type: DataTypes.INTEGER(1),
			allowNull: false,
			defaultValue: '0'
		},
		custom1: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom2: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom3: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom4: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom5: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom6: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom7: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom8: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom9: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		custom10: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		// don't add the timestamp attributes (updatedAt, createdAt)
		timestamps: true,

		// don't delete database entries but set the newly added attribute deletedAt
		// to the current date (when deletion was done). paranoid will only work if
		// timestamps are enabled
		paranoid: true,
		tableName: 'profitGuru_items',
		classMethods: {
			isItemExists: function(itemNumber, itemName) {
				if (!itemId)
					itemId = '';

				var defered = q.defer();
				this.findAndCountAll({
					where: {
						deletedAt: {
							$eq: null
						},
						item_number: itemNumber,
						name: itemName
					}
				}).then(function(result) {
					defered.resolve(result.count > 0);
				}).catch(function(reason) {
					defered.reject(reason);
				});
				return defered.promise;
			}
		}
	});
};