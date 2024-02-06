import Sequelize, { Model, DataTypes } from 'sequelize';

class Store extends Model {
	static init(sequelize) {
		super.init(
			{
				id: {
					type: DataTypes.INTEGER,
					primaryKey: true,
					autoIncrement: true,
				},
				store_id: Sequelize.BIGINT,
				timestamp_utc: Sequelize.STRING,
				status: Sequelize.STRING,
			},
			{
				sequelize,
				tableName: 'Store',
			}
		);
	}
}
export default Store;
