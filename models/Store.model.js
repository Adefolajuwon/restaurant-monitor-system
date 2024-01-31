import Sequelize, { Model,DataTypes } from 'sequelize';

class Timezone extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				store_id: Sequelize.INTEGER,
				timestamps_utc: Sequelize.DATE,
                status: Sequelize.STRING
			},
			{
				sequelize,
				timestamps: true,
				tableName: 'Store',
			}
		);
	}
}
export default Timezone;
