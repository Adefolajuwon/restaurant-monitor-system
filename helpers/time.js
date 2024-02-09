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
		const parsedDate = parseDate(timestamps);
		console.log(parsedDate);
		const maxDate = getMaxDate(parsedDate);
		console.log(maxDate);
		// console.log(timestamps);
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
/**This function takes an array of strings and converts the array elements to date format */
function _convertStringToDate(array) {
	const result = [];
	for (let i = 0; i < array.length; i++) {
		const dateTimeObject = DateTime.fromISO(array[i], { zone: 'UTC' });
		const date = dateTimeObject.toISO();
		result.push(date);
	}
	console.log(result);
	return result;
}

function parseDate(dateString) {
	return DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss.SSSSSS 'UTC'");
}

function getMaxDate(dateStrings) {
	const dates = dateStrings.map((dateString) =>
		DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss.SSSSSS 'UTC'")
	);
	return DateTime.max(...dates);
}
uptime_last_hour('299331931566263572');
