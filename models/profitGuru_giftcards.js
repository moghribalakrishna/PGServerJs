/* jshint indent: 1 */
//TODO Custmers now Made to own giftcards rather than persons table
module.exports = function(sequelize, DataTypes) {
	var giftCardsModel = sequelize.define('profitGuru_giftcards', {
		record_time: {
			type: DataTypes.TIME,
			allowNull: false,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
		},
		customer_id: {
			type: DataTypes.INTEGER(10),
			allowNull: true,
			references: {
				model: 'profitGuru_customers',
				key: 'person_id'
			}
		},
		giftcard_id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			allowNull: false,
			primaryKey: true
		},
		value: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: undefined
		}
	}, {
		timestamps: true,
		paranoid: true,
		tableName: 'profitGuru_giftcards',
		classMethods: {
			associate: function(models) {
				giftCardsModel.belongsTo(models.profitGuru_customers, {
					foreignKey: 'customer_id',
					constraints: true
				});
			}
		}
	});

	return giftCardsModel;
};