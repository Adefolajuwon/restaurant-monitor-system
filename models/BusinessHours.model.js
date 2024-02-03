import Sequelize, { Model, DataTypes } from 'sequelize';

class Business extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true, // Set id as the primary key
					autoIncrement: true, // Enable auto-increment for the primary key
				},
				store_id: Sequelize.BIGINT,
				day_of_week: Sequelize.INTEGER,
				start_time_local: Sequelize.TIME,
				end_time_local: Sequelize.TIME,
			},
			{
				sequelize,
				timestamps: true,
				tableName: 'BusinessHours',
			}
		);
	}
}
export default Business;
