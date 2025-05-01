import { UpdateUserDto, UserDto } from '../../dtos/user.dto';
import { CreateUserModel } from '../../models/user.model';
import { AuthProvider, User } from '../../prisma/generated';

export interface IUserService {
  findById(id: string): Promise<UserDto | null>;
  findByEmail(email: string, includePassword: boolean): Promise<UserDto | null>;
  findByPhoneNumber(phoneNumber: string): Promise<UserDto | null>;
  findByProviderId(providerId: string, provider: AuthProvider): Promise<UserDto | null>;
  create(data: CreateUserModel): Promise<UserDto | null>;
  update(id: string, data: UpdateUserDto): Promise<UserDto | null>;
  delete(id: string): Promise<UserDto | null>;
  convertToDto(user: User, includePassword: boolean): UserDto;
}
