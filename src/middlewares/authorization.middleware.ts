import { Request, Response, NextFunction } from 'express';
import { CustomRequest } from './authentication.middleware';

import PlainDto from '../dtos/plain.dto';
import CustomResponse from '../dtos/custom-response';
import { Roles } from '../enums/roles.enum';
import { UserService } from '../services/user.service';
import { TYPES } from '../config/ioc.types';
import IUnitOfService from '../services/interfaces/iunitof.service';
import container from '../config/ioc.config';

const authorization = (roles: Array<Roles>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = ((req as CustomRequest).token.payload.id || '') as string;

    const unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService);
    const user = await unitOfService.User.findById(userId);

    if (!user) {
      const response: CustomResponse<PlainDto> = {
        success: false,
        message: 'User not found',
      };
      return res.status(404).json(response);
    }

    // Ensure the user's role is contained in the authorized roles.
    const hasMatchingRole = roles.includes(user.role as Roles);
    if (hasMatchingRole) {
      next();
    } else {
      //throw new ForbiddenError('Not enough permissions');
      const response: CustomResponse<PlainDto> = {
        success: false,
        message: 'Not enough permissions',
      };
      res.status(403).json(response);
      return;
    }
  };
};

export default authorization;
