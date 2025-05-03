import { inject, injectable } from 'inversify';
import { TYPES } from '../config/ioc.types';
import { UpdateUserDto, UserDto } from '../dtos/user.dto';
import { CreateUserModel } from '../models/user.model';
import { AuthProvider, User, UserRole } from '../prisma/generated';
import IUnitOfWork from '../repositories/interfaces/iunitofwork.repository';
import PasswordUtils from '../utils/password.utils';
import { IUserService } from './interfaces/iuser.service';

@injectable()
export class UserService implements IUserService {
  constructor(@inject(TYPES.IUnitOfWork) private unitOfWork: IUnitOfWork) {}

  /**
   * Retrieves a user by unique identifier.
   *
   * @param id - The unique identifier of the user to retrieve.
   * @returns A promise that resolves to a `UserDto` if the user is found, or `null` if not found.
   */
  async findById(id: string): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findById(id);
    if (!user) {
      return null;
    }
    return this.convertToDto(user);
  }

  /**
   * Retrieves a user by email address.
   *
   * @param email - The email address of the user to find.
   * @param includePassword - Optional. Whether to include the user's password in the returned DTO. Defaults to false.
   * @returns A promise that resolves to a UserDto if the user is found, or null otherwise.
   */
  async findByEmail(email: string, includePassword: boolean = false): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findByEmail(email);
    if (!user) {
      return null;
    }
    return this.convertToDto(user, includePassword);
  }

  /**
   * Finds a user by phone number.
   *
   * @param phoneNumber - The phone number to search for.
   * @returns A promise that resolves to a UserDto if a user is found, or null otherwise.
   */
  async findByPhoneNumber(phoneNumber: string): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findByPhoneNumber(phoneNumber);
    if (!user) {
      return null;
    }
    return this.convertToDto(user);
  }

  /**
   * Finds a user by provider ID and authentication provider.
   *
   * @param providerId - The unique identifier assigned by the authentication provider.
   * @param provider - The authentication provider (e.g., Google, Facebook).
   * @returns A promise that resolves to a `UserDto` if a matching user is found, or `null` otherwise.
   */
  async findByProviderId(providerId: string, provider: AuthProvider): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findByProviderId(providerId, provider);
    if (!user) {
      return null;
    }
    return this.convertToDto(user);
  }

  /**
   * Creates a new user with the specified data and role.
   *
   * @param data - The user data required for creation, including email, password, and personal details.
   * @param role - The role to assign to the new user.
   * @returns A promise that resolves to the created user's DTO, or null if creation fails.
   */
  async create(data: CreateUserModel, role: UserRole): Promise<UserDto | null> {
    const hashedPassword = await PasswordUtils.hashPassword(data.password);
    const user = await this.unitOfWork.User.create({
      email: data.email,
      passwordHash: hashedPassword,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      phoneCountryCode: data.phoneCountryCode,
      isEmailVerified: false,
      isPhoneVerified: false,
      twoFactorEnabled: false,
      role: role,
      provider: AuthProvider.CREDENTIALS,
      isActive: true,
    });
    return this.convertToDto(user);
  }

  /**
   * Updates a user's information by unique identifier.
   *
   * @param id - The unique identifier of the user to update.
   * @param data - The data to update the user with, conforming to the UpdateUserDto.
   * @returns A promise that resolves to the updated user's DTO, or null if the user was not found.
   */
  async update(id: string, data: UpdateUserDto): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.update(id, {
      ...data,
    });
    if (!user) {
      return null;
    }
    return this.convertToDto(user);
  }

  /**
   * Deletes a user by their unique identifier.
   *
   * @param id - The unique identifier of the user to delete.
   * @returns A promise that resolves to the deleted user's DTO if found and deleted, or null if no user was found with the given id.
   */
  async delete(id: string): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.delete(id);
    return this.convertToDto(user);
  }

  /**
   * Converts a User entity to a UserDto object.
   *
   * @param user - The User entity to convert.
   * @param includePassword - Optional. If true, includes the user's password hash in the DTO; otherwise, omits it. Defaults to false.
   * @returns The UserDto representation of the given User entity.
   */
  convertToDto(user: User, includePassword: boolean = false): UserDto {
    return {
      id: user.id,
      email: user.email,
      passwordHash: includePassword ? user.passwordHash : undefined,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      phoneCountryCode: user.phoneCountryCode,
      dateOfBirth: user.dateOfBirth,
      profileImageUrl: user.profileImageUrl,
      provider: user.provider,
      providerId: user.providerId,
      isEmailVerified: user.isEmailVerified,
      isPhoneVerified: user.isPhoneVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      twoFactorSecret: user.twoFactorSecret,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

export default UserService;
