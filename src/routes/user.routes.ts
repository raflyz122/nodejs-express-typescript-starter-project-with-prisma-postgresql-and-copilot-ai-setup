import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.middleware';
import validateSchema from '../middlewares/validation.middleware';
import CreateUserValidator from '../validators/user.validator';
import { UserController } from '../controllers/user.controller';
import { TYPES } from '../config/ioc.types';
import container from '../config/ioc.config';

const userRouter = Router();

const userController = container.get<UserController>(TYPES.UserController);

userRouter.get('/getbyemail', asyncHandler(userController.getUserByEmail));
userRouter.get('/:id', asyncHandler(userController.getUserById));
userRouter.post('/', [validateSchema(CreateUserValidator)], asyncHandler(userController.createUser));
userRouter.put('/:id', asyncHandler(userController.updateUserById));
userRouter.delete('/:id', asyncHandler(userController.deleteUserById));

export default userRouter;
