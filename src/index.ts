import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import routes from './routes/index.routes';
import ClientIdMiddleware from './middlewares/clientid.middleware';
import asyncHandler from './middlewares/asyncHandler.middleware';
import errorHandler from './middlewares/errorHandler.middleware';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

//setup public directory
app.use(express.static(path.join(__dirname, 'public')));

// parse application/json
app.use(bodyParser.json());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//setup cors
app.use(cors());

app.use(asyncHandler(ClientIdMiddleware.verify));

//route setup
app.use('/api', routes);

// Error-handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
