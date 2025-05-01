import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';
import { UserFilterParams } from '../../params/user.params';
import { AuthProvider, User, UserRole } from '../../prisma/generated';

export interface IUserRepository {
  findAll(
    filters?: UserFilterParams,
    page?: number,
    limit?: number,
    sortBy?: string,
    sortOrder?: string
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;
  findByProviderId(providerId: string, provider: AuthProvider): Promise<User | null>;
  create(data: CreateUserDto): Promise<User>;
  update(id: string, data: UpdateUserDto): Promise<User>;
  delete(id: string): Promise<User>;
  updatePassword(id: string, passwordHash: string): Promise<User>;
  verifyEmail(id: string): Promise<User>;
  setTwoFactorEnabled(id: string, enabled: boolean, secret?: string): Promise<User>;
  updateRole(id: string, role: UserRole): Promise<User>;
  setActiveStatus(id: string, isActive: boolean): Promise<User>;
  countByRole(): Promise<{ role: UserRole; count: number }[]>;
  findByDateRange(startDate: Date, endDate: Date, page: number, limit: number): Promise<{ users: User[]; total: number }>;
}
