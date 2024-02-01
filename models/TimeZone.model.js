import Sequelize, { Model, DataTypes } from 'sequelize';

class Timezone extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				store_id: Sequelize.STRING,
				timezone_str: Sequelize.STRING,
			},
			{
				sequelize,
				timestamps: true,
				tableName: 'Timezone',
			}
		);
	}
}
export default Timezone;
