import Sequelize, { Model } from 'sequelize';

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
				timezon_str: Sequelize.INTEGER,
			},
			{
				sequelize,
				timestamps: true,
				tableName: 'TimezoneTable',
			}
		);
	}
}
export default Timezone;
