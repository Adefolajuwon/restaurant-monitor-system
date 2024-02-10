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
							importData(buffer);
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
					setTimeout(() => {
						console.log('Processing remaining buffer:', buffer);
						buffer = [];
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
const importData = async (buffer) => {
	/**the result of this operation should look likethis
	 * [
	 *['1261687550619351810', 'inactive', '2023-01-20 09:04:04.458723 UTC'],
	 *['4159465907457430553', 'inactive', '2023-01-21 11:07:55.705372 UTC'],
	 *]
	 */
	const splitbuffer = buffer
		.join('\n')
		.split('\n')
		.map((row) => row.split(','));

	const columns = ['store_id', 'timestamp_utc', 'status'];
	// splitbuffer.shift();

	const data = splitbuffer.map((row) => {
		const rowData = {};

		if (
			//check if there are no empty buffer to prevent error when uploading to db
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

	async function importDB() {
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
	importDB();
};

// importData();
StoreStream(store);
