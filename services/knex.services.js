import knex from 'knex';
import config from '../config/knex.js';

export const db = knex({
	client: 'pg',
	connection: {
		host: config.DB_HOST,
		port: 5432,
		user: config.username || 'root',
		password: config.password || '',
		database: config.database || 'default',
	},
	migrations: {
		tableName: 'knex_migrations',
	},
});
