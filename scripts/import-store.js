import { promises as fs } from 'fs';
import { Sequelize } from 'sequelize';
import Store from '../models/Store.model.js';
// import csv from 'csv-parser';
import { connection } from '../services/sequelize.service.js';
import { through2 } from 'through2';
const store = './data/store-status.csv';

const fileHandleRead = await fs.open(store, 'r');

/**
 * create a read stream for getting data from csv
 */
const StoreStream = async (filePath, promiseThunk, bufferSize) => {
	const bufferSize = 100;
	return new Promise((resolve, reject) => {
		const stream = fs.createReadStream(filePath, { encoding: 'utf8' });
		let buffer = [];
		stream
			.pipe(split2())
			//ensure that the next chunk will be processed by the
			//stream only when we want to
			.pipe(
				through2((chunk, enc, callback) => {
					//put the chunk along with the other ones
					buffer.push(chunk.toString());
					if (buffer.length < bufferSize) {
						callback(); //next step, no process
					} else {
						//call the method that creates a promise, and at the end
						//just empty the buffer, and process the next chunk
						return new Promise((resolve, reject) =>
							buffer.finally(() => {
								buffer = [];
								callback();
							})
						);
					}
				})
			)
			.on('error', (error) => {
				reject(error);
			})
			.on('finish', () => {
				//any remaining data still needs to be sent
				//resolve the outer promise only when the final batch has completed processing
				if (buffer.length > 0) {
					return new Promise((resolve, reject) =>
						buffer.finally(() => {
							resolve(true);
						})
					);
				} else {
					resolve(true);
				}
			});
	});
};
/**splits the string into array line using '/n' as delimiter
 * then map over each line represented by 'row' and slits into a array using ',' as delimeter
 * get the first array(the csv headers)
 * and finally remove the first element(header) using rows.shift()
 */
const rows = await StoreStream(store).then((data) =>
	data.split('\n').map((row) => row.split(','))
);
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
