import fs from 'fs';
import Timezone from '../models/TimeZone.model.js';
import { Sequelize } from 'sequelize';
// import csv from 'csv-parser';
import sequelizeService from '../services/sequelize.service.js';
const timezones = './data/timezones.csv';

const TimeZone = async () => {
	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(timezones, 'utf-8');
		let data = '';

		stream.on('data', (chunk) => {
			data += chunk;
		});

		stream.on('end', () => {
			resolve(data);
		});

		stream.on('error', (error) => {
			reject(error);
		});
	});
};
const rows = await TimeZone().then((data) =>
	data.split('\n').map((row) => row.split(','))
);
const columns = rows[0];
rows.shift();
// console.log(rows);
// console.log(columns);

const data = rows.map((row) => {
	const rowData = {};

	// Check if the row is not empty
	if (
		row.some((value) => value !== undefined && value !== null && value !== '')
	) {
		columns.forEach((column, index) => {
			// Check if the value in the current row and column is not empty
			if (
				row[index] !== undefined &&
				row[index] !== null &&
				row[index] !== ''
			) {
				// Assign the value to the rowData object
				rowData[column] = row[index];
			}
			// If the value is empty, it will be skipped
		});
	}

	return rowData;
});

// Remove any empty objects from the resulting array
const filteredData = data.filter((obj) => Object.keys(obj).length > 0);
console.log(filteredData);
async function importData() {
	try {
		// await sequelizeService.authenticate(); // Check if the connection to the database is successful
		// await Sequelize.sync({ force: true });

		await Timezone.bulkCreate(filteredData);
		console.log('Data imported successfully!');
	} catch (error) {
		console.error('Error importing data:', error);
	}
}

importData();
