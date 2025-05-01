import { Request, Response } from 'express';
import CustomResponse from '../dtos/custom-response';
import { UpdateUserDto, UserDto } from '../dtos/user.dto';
import { CreateUserModel } from '../models/user.model';
import CustomError from '../exceptions/custom-error';
import container from '../config/ioc.config';
import IUnitOfService from '../services/interfaces/iunitof.service';
import { TYPES } from '../config/ioc.types';

export class UserController {
  constructor(private unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService)) {
    this.unitOfService = unitOfService;
  }

  getUserById = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const userId = req.params.id;
    const user = await this.unitOfService.User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };

  getUserByEmail = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const email = req.query.email as string;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await this.unitOfService.User.findByEmail(email, false);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };

  createUser = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const data = req.body as CreateUserModel;

    let user = await this.unitOfService.User.findByEmail(data.email, false);
    if (user) {
      throw new CustomError('User already exists', 409);
    }

    user = await this.unitOfService.User.create(data);

    let response: CustomResponse<UserDto>;

    if (!user) {
      response = {
        success: false,
        message: 'User creation failed',
      };
      return res.status(400).json(response);
    }

    response = {
      success: true,
      data: user,
    };

    return res.status(201).json(response);
  };

  updateUserById = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const userId = req.params.id;
    const data = req.body as UpdateUserDto;
    const user = await this.unitOfService.User.update(userId, data);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };

  deleteUserById = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const userId = req.params.id;
    const user = await this.unitOfService.User.delete(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };
}
