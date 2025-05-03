import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.middleware';
import validateSchema from '../middlewares/validation.middleware';
import LoginValidator from '../validators/login.validator';
import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import { AccountController } from '../controllers/account.controller';
import CreateUserValidator from '../validators/user.validator';
import authentication from '../middlewares/authentication.middleware';

const accountRouter = Router();

const accountController = container.get<AccountController>(TYPES.AccountController);

accountRouter.post('/login', [validateSchema(LoginValidator)], asyncHandler(accountController.login));
accountRouter.post('/register', [validateSchema(CreateUserValidator)], asyncHandler(accountController.register));
accountRouter.post('/refresh-token', [authentication], asyncHandler(accountController.refreshToken));
accountRouter.post('/logout', [authentication], asyncHandler(accountController.logout));
export default accountRouter;
