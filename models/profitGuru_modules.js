/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('profitGuru_modules', {
		name_lang_key: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		desc_lang_key: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined
		},
		sort: {
			type: DataTypes.INTEGER(10),
			allowNull: false,
			defaultValue: undefined
		},
		module_id: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: undefined,
			primaryKey: true
		}
	}, {
		tableName: 'profitGuru_modules'
	});
};
