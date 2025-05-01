import { Request, Response } from 'express';
import CustomResponse from '../dtos/custom-response';
import { LoginModel } from '../models/login.model';
import PasswordUtils from '../utils/password.utils';
import * as jwt from 'jsonwebtoken';
import config from '../config';
import container from '../config/ioc.config';
import IUnitOfService from '../services/interfaces/iunitof.service';
import { TYPES } from '../config/ioc.types';

export class AccountController {
  constructor(private unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService)) {
    this.unitOfService = unitOfService;
  }

  login = async (req: Request, res: Response): Promise<Response<CustomResponse<string>>> => {
    const model = req.body as LoginModel;
    let response: CustomResponse<string>;

    const user = await this.unitOfService.User.findByEmail(model.email, true);
    if (!user) {
      response = {
        success: false,
        message: 'Invalid username or password',
      };
      return res.status(401).json(response);
    }

    const isPasswordValid = await PasswordUtils.comparePassword(model.password, user.passwordHash || '');
    if (!isPasswordValid) {
      response = {
        success: false,
        message: 'Invalid username or password',
      };
      return res.status(401).json(response);
    }

    // Generate and sign a JWT that is valid for one hour.
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profileImageUrl: user.profileImageUrl,
        phoneNumber: user.phoneNumber,
        phoneCountryCode: user.phoneCountryCode,
        role: user.role?.toString(),
      },
      config.jwt.secret,
      {
        expiresIn: '30d',
        algorithm: 'HS256',
        audience: config.jwt.audience,
        issuer: config.jwt.issuer,
        notBefore: '0', // Cannot use before now, can be configured to be deferred.
      }
    );

    response = {
      success: true,
      message: 'Login successful',
      data: token,
    };

    return res.status(200).json(response);
  };

  refreshToken = async (req: Request, res: Response): Promise<Response<CustomResponse<string>>> => {
    const { token } = req.body;
    let response: CustomResponse<string>;

    const decoded = jwt.verify(token, config.jwt.secret || '', {
      audience: config.jwt.audience,
      issuer: config.jwt.issuer,
    });

    const newToken = jwt.sign(
      {
        id: (decoded as any).id,
        email: (decoded as any).email,
        firstName: (decoded as any).firstName,
        lastName: (decoded as any).lastName,
        profileImageUrl: (decoded as any).profileImageUrl,
        phoneNumber: (decoded as any).phoneNumber,
        phoneCountryCode: (decoded as any).phoneCountryCode,
      },
      config.jwt.secret || '',
      {
        expiresIn: '30d',
        algorithm: 'HS256',
        audience: config.jwt.audience,
        issuer: config.jwt.issuer,
        notBefore: '0',
      }
    );

    response = {
      success: true,
      message: 'Token refreshed successfully',
      data: newToken,
    };

    return res.status(200).json(response);
  };

  logout = async (req: Request, res: Response): Promise<Response<CustomResponse<null>>> => {
    // Invalidate the token (implementation depends on token storage strategy, e.g., blacklist)
    const response: CustomResponse<null> = {
      success: true,
      message: 'Logout successful',
      data: null,
    };

    return res.status(200).json(response);
  };
}
