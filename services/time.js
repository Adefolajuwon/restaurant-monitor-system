import { db } from './knex.services.js';
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
		const parsedDate = _parseDate(timestamps);
		const businessHours = business_hours(store_id);
		console.log(parsedDate);
		// const maxDate = getMaxDate(timestamps);
		// console.log(maxDate);
	} catch (error) {
		console.error('Error querying the database:', error);
	}
};
/**Get the business hours for a store
 *dayOfWeek(0=Monday, 6=Sunday), start_time_local, end_time_local
 *If data is missing for a store, assume it is open 24*7
 *this is used to get the time interval
 */
const business_hours = async (store_id) => {
	const extractedData = [];
	const hours = await db('BusinessHours').where('store_id', '=', store_id);
	for (let i = 0; i < hours.length; i++) {
		const { start_time_local, day, end_time_local } = hours[i];
		extractedData.push({ start_time_local, day, end_time_local });
	}
	console.log(extractedData);
	return extractedData;
};

/**the function takes an array of businesss hours for a particular store and the purpose of this function is to calulate the intersect of a business hour within a particular time interval
 *
 */
function _calculateBusinessOverlap(businessHours, timezone) {
	const extractedData = [];
	const utcTimesArray = [];
	// let start_time_local, end_time_local;

	const startDay = DateTime.now()
		.startOf('day')
		.toUTC()
		.toISOTime({ includeOffset: false });
	const endDay = startDay
		.plus({ days: 1 })
		.startOf('day')
		.toUTC()
		.toISOTime({ includeOffset: false });

	for (let i = 0; i < hours.length; i++) {
		let { start_time_local, end_time_local } = businessHours[i];
		extractedData.push({ start_time_local, end_time_local });
	}
	extractedData.forEach((localElement) => {
		const startTimeUTC = DateTime.fromISO(
			`1970-01-01T${localElement.start_time_local}`
		)
			.toUTC()
			.toISOTime();
		const endTimeUTC = DateTime.fromISO(
			`1970-01-01T${localElement.end_time_local}`
		)
			.toUTC()
			.toISOTime();
		utcTimesArray.push({
			start_time_utc: startTimeUTC,
			end_time_utc: endTimeUTC,
		});
	});
	const business_day_start = new Date(
		Math.max(startDay.getTime(), start_time_utc.getTime())
	);

	// console.log(extractedData);
	console.log(startDay);
	console.log(utcTimesArray);
}
const hours = [
	{ start_time_local: '00:00:00', day: 4, end_time_local: '00:10:00' },
	{ start_time_local: '00:00:00', day: 2, end_time_local: '00:10:00' },
	{ start_time_local: '00:00:00', day: 0, end_time_local: '00:10:00' },
	{ start_time_local: '00:00:00', day: 1, end_time_local: '00:10:00' },
	{ start_time_local: '00:00:00', day: 5, end_time_local: '00:10:00' },
];
_calculateBusinessOverlap(hours, 'america/chicago');

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
function _parseDate(dateArray) {
	const formattedDates = [];
	for (let i = 0; i < dateArray.length; i++) {
		// Split the string by space to separate date and time
		const parts = dateArray[i].split(' ');
		console.log(parts);

		if (parts.length === 2) {
			// Get the date and time parts
			const dateString = parts[0];
			const timeString = parts[1];

			const isoString = `${dateString}T${timeString.replace(' UTC', '')}`;

			const dateTimeObject = DateTime.fromISO(isoString, { zone: 'UTC' });
			formattedDates.push(dateTimeObject);
		}
	}
	console.log(formattedDates);
	return formattedDates;
}

function _parseDateArray(dateArray) {
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

// parseDateArray(array);
function _getMaxDate(dateStrings) {
	const dates = dateStrings.map((dateString) =>
		DateTime.fromFormat(dateString, "yyyy-MM-dd HH:mm:ss.SSSSSS 'UTC'")
	);
	return DateTime.max(...dates);
}
// uptime_last_hour('299331931566263572');
