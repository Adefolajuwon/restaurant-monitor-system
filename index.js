import http from 'http';
import express from 'express';
import { sequelizeService } from './services/sequelize.service.js';

const PORT = process.env.PORT || 3005;

const serverApp = express();
serverApp.set('trust proxy', true);

// Middleware to set content type
serverApp.use((req, res, next) => {
	res.setHeader('Content-Type', 'application/json');
	next();
});

// Middleware to parse JSON requests
serverApp.use(express.json());

// Error handling middleware
serverApp.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something went wrong!');
});

const server = http.createServer(serverApp);

// Initialize Sequelize and start server
sequelizeService.init().then(async () => {
	server.listen(PORT, () => {
		console.log(`Server started on PORT ${PORT}...`);
	});
});
