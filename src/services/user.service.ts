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

  async findById(id: string): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findById(id);
    if (!user) {
      return null;
    }
    return this.convertToDto(user);
  }

  async findByEmail(email: string, includePassword: boolean = false): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findByEmail(email);
    if (!user) {
      return null;
    }
    return this.convertToDto(user, includePassword);
  }

  async findByPhoneNumber(phoneNumber: string): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findByPhoneNumber(phoneNumber);
    if (!user) {
      return null;
    }
    return this.convertToDto(user);
  }

  async findByProviderId(providerId: string, provider: AuthProvider): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.findByProviderId(providerId, provider);
    if (!user) {
      return null;
    }
    return this.convertToDto(user);
  }

  async create(data: CreateUserModel): Promise<UserDto | null> {
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
      role: UserRole.USER,
      provider: AuthProvider.CREDENTIALS,
      isActive: true,
    });
    return this.convertToDto(user);
  }

  async update(id: string, data: UpdateUserDto): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.update(id, {
      ...data,
    });
    if (!user) {
      return null;
    }
    return this.convertToDto(user);
  }

  async delete(id: string): Promise<UserDto | null> {
    const user = await this.unitOfWork.User.delete(id);
    return this.convertToDto(user);
  }

  //convert User to UserDto
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
