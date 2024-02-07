import http from 'http';
import express from 'express';

const PORT = process.env.PORT || 7000;

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

// Async function to start the server
async function startServer() {
	await server.listen(PORT);
	console.log(`Server started on PORT ${PORT}...`);
}

// Call the async function to start the server
startServer().catch((err) => {
	console.error('Error starting server:', err);
});
