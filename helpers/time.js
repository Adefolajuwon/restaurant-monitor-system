import Timezone from '../models/TimeZone.model.js';
import Business from '../models/BusinessHours.model.js';
import { DateTime } from 'luxon';

export const compute_uptime = async () => {};

const getTimeZone = async (store_id) => {
	const timezone = await Timezone.findOne({ where: { store_id } });
	console.log(timezone);
};

getTimeZone('9055649751952768824');
