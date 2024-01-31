import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.js';

import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const modelsPath = join(__dirname, '/../models/');

// Now you can use readdirSync with the correct path
const files = readdirSync(modelsPath);

const sequelizeService = {
	init: async () => {
		try {
			let connection = new Sequelize(databaseConfig);

			/*
        Loading models automatically
      */ 

			for (const file of files) {
				const modelModule = await import(`../models/${file}`);
				const model = modelModule.default;

				if (model && typeof model.init === 'function') {
					model.init(connection);
				} else {
					console.warn(
						`[SEQUELIZE] Skipping model initialization for ${file}. Missing init method.`
					);
				}
			}

			files.map(async (file) => {
				const modelModule = await import(`../models/${file}`);
				const model = modelModule.default;

				if (model && typeof model.associate === 'function') {
					model.associate(connection.models);
				} else {
					console.warn(
						`[SEQUELIZE] Skipping model association for ${file}. Missing associate method.`
					);
				}
			});

			console.log('[SEQUELIZE] Database service initialized');
		} catch (error) {
			console.error('[SEQUELIZE] Error during database service initialization');
			throw error;
		}
	},
};

export default sequelizeService;
