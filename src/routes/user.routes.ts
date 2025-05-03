import { Router } from 'express';
import asyncHandler from '../middlewares/asyncHandler.middleware';
import { UserController } from '../controllers/user.controller';
import { TYPES } from '../config/ioc.types';
import container from '../config/ioc.config';
import authentication from '../middlewares/authentication.middleware';
import { Roles } from '../enums/roles.enum';
import authorization from '../middlewares/authorization.middleware';

const userRouter = Router();

const userController = container.get<UserController>(TYPES.UserController);

userRouter.get('/getbyemail', asyncHandler(userController.getUserByEmail));
userRouter.get('/:id', asyncHandler(userController.getUserById));
userRouter.put('/:id', [authentication], asyncHandler(userController.updateUserById));
userRouter.delete('/:id', [authentication, authorization([Roles.Administrator])], asyncHandler(userController.deleteUserById));

export default userRouter;
