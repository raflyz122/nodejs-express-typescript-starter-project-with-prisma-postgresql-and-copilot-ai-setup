import express from 'express';
import healthRouter from './health.routes';
import userRouter from './user.routes';
import accountRouter from './account.routes';

const routes = express.Router();

routes.use('/health', healthRouter);
routes.use('/users', userRouter);
routes.use('/auth', accountRouter);

export default routes;
