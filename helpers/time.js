import { db } from '../services/knex.services.js';
import { DateTime } from 'luxon';

const dateTime = DateTime.now();
export const uptime_last_hour = async () => {
	try {
	} catch (error) {}
};

const getTimeZone = async (store_id) => {
	try {
		let timezone;
		timezone = await db('Timezone').first().where('store_id', '=', store_id);
		if (!timezone) {
			timezone = {
				timezone_str: dateTime.setZone('America/Chicago'),
			};
		}
		console.log(timezone);
	} catch (error) {
		console.error('Error fetching timezone:', error);
	}
};
