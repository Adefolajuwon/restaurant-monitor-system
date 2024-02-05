import fs from 'fs';
import { Sequelize } from 'sequelize';
import Store from '../models/Store.model.js';
import split2 from 'split2';
// import csv from 'csv-parser';
import { connection } from '../services/sequelize.service.js';
import through2 from 'through2';
const store = './data/store-status.csv';

// const fileHandleRead = await fs.open(store, 'r');

/**
 * create a read stream for getting data from csv
 */
const StoreStream = async (filePath) => {
	const bufferSize = 100;
	let buffer = [];

	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(filePath);

		stream
			.pipe(split2())
			.pipe(
				through2((chunk, enc, callback) => {
					buffer.push(chunk.toString());
					if (buffer.length < bufferSize) {
						callback();
					} else {
						// Process the buffer and clear it asynchronously
						setTimeout(() => {
							console.log('Processing buffer:', buffer);
							buffer = []; // Clear the buffer
							callback();
						}, 0);
					}
				})
			)
			.on('error', (error) => {
				reject(error);
			})
			.on('finish', () => {
				// Process any remaining data in the buffer
				if (buffer.length > 0) {
					// Asynchronously process the remaining buffer
					setTimeout(() => {
						// Your processing logic here
						console.log('Processing remaining buffer:', buffer);
						buffer = []; // Clear the buffer
						resolve();
					}, 0);
				} else {
					resolve();
				}
			});
	});
};

/**splits the string into array line using '/n' as delimiter
 * then map over each line represented by 'row' and slits into a array using ',' as delimeter
 * get the first array(the csv headers)
 * and finally remove the first element(header) using rows.shift()
 */
const rows = await StoreStream(store)
	.then((data) => {
		// Log the data to check if it's undefined
		console.log('Data from StoreStream:', data);

		// Assuming StoreStream returns a promise that resolves with the data
		return data.split('\n').map((row) => row.split(','));
	})
	.catch((error) => {
		console.error('Error reading and processing the file:', error);
		return []; // Return an empty array or handle the error accordingly
	});

const columns = rows[0];
rows.shift();

const data = rows.map((row) => {
	const rowData = {};

	if (
		//check if there are no empty rows to prevent error when uploading to db
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
async function importData() {
	try {
		await connection.sync({ force: true });
		Store.init(connection);

		await Store.bulkCreate(filteredData);
		// console.log(filteredData);

		console.log('Data imported successfully!');
	} catch (error) {
		console.error('Error importing data:', error);
	}
}

importData();
