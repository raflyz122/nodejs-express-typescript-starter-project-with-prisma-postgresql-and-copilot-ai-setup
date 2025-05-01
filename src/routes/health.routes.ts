import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.middleware';
import { TYPES } from '../config/ioc.types';
import { HealthController } from '../controllers/health.controller';
import container from '../config/ioc.config';

const healthRouter = Router();

const healthController = container.get<HealthController>(TYPES.HealthController);

healthRouter.get('/check', asyncHandler(healthController.check));

export default healthRouter;
