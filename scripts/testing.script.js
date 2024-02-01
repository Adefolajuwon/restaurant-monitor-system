import Sequelize from 'sequelize';
import Timezone from '../models/TimeZone.model.js';

const singleData = {
	store_id: '8139926242460185114',
	timezone_str: 'Asia/Beirut',
};

const insertDataIntoTimezone = async () => {
	try {
		await Timezone.sync({ force: true });

		// Insert a single record into the Timezone model
		await Timezone.create(singleData);

		console.log('Data inserted successfully!');
	} catch (error) {
		console.error('Error inserting data:', error);
	}
};

insertDataIntoTimezone();
