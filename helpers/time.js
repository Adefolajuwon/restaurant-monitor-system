import { db } from '../services/knex.services.js';
import { DateTime } from 'luxon';

const dateTime = DateTime.now();
export const uptime_last_hour = async (store_id) => {
	try {
		let storeArray;
		const timestamps = [];
		storeArray = await db('Store').where('store_id', '=', store_id);
		if (!storeArray || storeArray.length === 0) {
			console.log('No store found with the provided store_id');
			return;
		}

		const timezone = await getTimeZone(store_id);

		for (let i = 0; i < storeArray.length; i++) {
			const obj = storeArray[i];
			timestamps.push(obj.timestamp_utc);
		}
	} catch (error) {
		console.error('Error querying the database:', error);
	}
};

/**Get the store timezon and if data is missing for the store set the timezone to 'america/chicago' */
const getTimeZone = async (store_id) => {
	try {
		let timezone;
		timezone = await db('Timezone').first().where('store_id', '=', store_id);
		if (!timezone) {
			timezone = {
				timezone_str: dateTime.setZone('America/Chicago'),
			};
		}
		// console.log(timezone);
	} catch (error) {
		console.error('Error fetching timezone:', error);
	}
};
uptime_last_hour('299331931566263572');
