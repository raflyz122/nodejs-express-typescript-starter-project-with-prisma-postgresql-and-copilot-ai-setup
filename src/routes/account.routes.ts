import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.middleware';
import validateSchema from '../middlewares/validation.middleware';
import LoginValidator from '../validators/login.validator';
import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import { AccountController } from '../controllers/account.controller';

const accountRouter = Router();

const accountController = container.get<AccountController>(TYPES.AccountController);

accountRouter.post('/login', [validateSchema(LoginValidator)], asyncHandler(accountController.login));
accountRouter.post('/refresh-token', asyncHandler(accountController.refreshToken));
accountRouter.post('/logout', asyncHandler(accountController.logout));
export default accountRouter;
