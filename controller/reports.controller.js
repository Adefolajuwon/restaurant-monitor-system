import { db } from '../services/knex.services';

export const triggerReport = async () => {
	try {
		const id = _generateRandomString(5);
		const data = {
			report_id: id,
			status: 'running',
			data: '',
		};
		const report = await db('Report').insert(data);
	} catch (error) {}
};

function _generateRandomString(length) {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
