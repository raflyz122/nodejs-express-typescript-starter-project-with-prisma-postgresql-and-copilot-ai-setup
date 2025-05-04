import { Request, Response } from 'express';
import CustomResponse from '../dtos/custom-response';
import { UpdateUserDto, UserDto } from '../dtos/user.dto';
import container from '../config/ioc.config';
import IUnitOfService from '../services/interfaces/iunitof.service';
import { TYPES } from '../config/ioc.types';
import CustomError from '../exceptions/custom-error';

export class UserController {
  constructor(private unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService)) {
    this.unitOfService = unitOfService;
  }

  /**
   * Retrieves the current user from the request.
   *
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns A promise that resolves to an Express response containing a `CustomResponse<UserDto>`.
   */
  getCurrentUser = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const userId = req.body?.currentUserId || '';
    if (!userId) {
      throw new CustomError('User ID is required', 400);
    }

    const user = await this.unitOfService.User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param req - Express request object containing the user ID in the route parameters.
   * @param res - Express response object used to send the response.
   * @returns A promise that resolves to an Express response containing a `CustomResponse<UserDto>`.
   *
   * @remarks
   * - Returns a 200 status code with the user data if found.
   * - Returns a 404 status code with an error message if the user is not found.
   */
  getUserById = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const userId = req.params.id;
    if (!userId) {
      throw new CustomError('User ID is required', 400);
    }

    const user = await this.unitOfService.User.findById(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };

  /**
   * Retrieves a user by their email address from the query parameters.
   *
   * @param req - The Express request object, expected to have an 'email' query parameter.
   * @param res - The Express response object.
   * @returns A promise that resolves to an Express response containing a CustomResponse with the UserDto data if found,
   *          or an error message if the email is missing or the user is not found.
   *
   * @remarks
   * - Responds with 400 if the email query parameter is missing.
   * - Responds with 404 if no user is found for the provided email.
   * - Responds with 200 and the user data if found.
   */
  getUserByEmail = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const email = req.query.email as string;
    if (!email) {
      throw new CustomError('Email is required', 400);
    }

    const user = await this.unitOfService.User.findByEmail(email);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };

  /**
   * Updates a user's information by their unique identifier.
   *
   * @param req - Express request object containing the user ID in `params.id` and update data in the request body.
   * @param res - Express response object used to send the response.
   * @returns A promise that resolves to an Express response containing a `CustomResponse` with the updated `UserDto` data,
   *          or a 404 status with an error message if the user is not found.
   */
  updateUserById = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const userId = req.params.id;
    const data = req.body as UpdateUserDto;
    const user = await this.unitOfService.User.update(userId, data);

    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };

  /**
   * Deletes a user by their unique identifier.
   *
   * @param req - Express request object containing the user ID in the route parameters.
   * @param res - Express response object used to send the response.
   * @returns A promise that resolves to an Express response containing a `CustomResponse<UserDto>`.
   *
   * @remarks
   * - Returns a 404 status code if the user is not found.
   * - Returns a 200 status code with the deleted user data on success.
   */
  deleteUserById = async (req: Request, res: Response): Promise<Response<CustomResponse<UserDto>>> => {
    const userId = req.params.id;
    const user = await this.unitOfService.User.delete(userId);
    if (!user) {
      throw new CustomError('User not found', 404);
    }

    const response: CustomResponse<UserDto> = {
      success: true,
      data: user,
    };

    return res.status(200).json(response);
  };
}
