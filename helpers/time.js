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
		// const maxDate = getMaxDate(timestamps);
		// console.log(maxDate);
	} catch (error) {
		console.error('Error querying the database:', error);
	}
};

/**Get the store timezone and if data is missing for the store set the timezone to 'america/chicago' */
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
function parseDate(dateArray) {
	const formattedDates = [];
	for (let i = 0; i < dateArray.length; i++) {
		// Split the string by space to separate date and time
		const parts = dateArray[i].split(' ');
		console.log(parts);

		if (parts.length === 2) {
			// Get the date and time parts
			const dateString = parts[0];
			const timeString = parts[1];

			// Remove the 'UTC' part from the time string
			const isoString = `${dateString}T${timeString.replace(' UTC', '')}`;

			// Parse the ISO 8601 formatted string
			const dateTimeObject = DateTime.fromISO(isoString, { zone: 'UTC' });
			formattedDates.push(dateTimeObject);
		}
	}
	console.log(formattedDates);
	return formattedDates;
}
const array = ['2023-01-24 05:54:11 UTC', '2023-01-19 00:04:47 UTC'];

function parseDateArray(dateArray) {
	const parsedDates = dateArray.map((dateString) => {
		try {
			return DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss 'UTC'");
		} catch (error) {
			console.error(`Error parsing date "${dateString}": ${error.message}`);
			return null;
		}
	});
	console.log(parsedDates);
	return parsedDates.filter((date) => date !== null);
}

parseDateArray(array);
function getMaxDate(dateStrings) {
	const dates = dateStrings.map((dateString) =>
		DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss.SSSSSS 'UTC'")
	);
	return DateTime.max(...dates);
}
// uptime_last_hour('299331931566263572');
