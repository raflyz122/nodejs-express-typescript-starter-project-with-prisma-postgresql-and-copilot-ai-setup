import prisma from '../prisma';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserFilterParams } from '../params/user.params';
import { AuthProvider, Prisma, User, UserRole } from '../prisma/generated';
import { IUserRepository } from './interfaces/iuser.repository';

export class UserRepository implements IUserRepository {
  /**
   * Find a user by their unique ID
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Find a user by their email address
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by their phone number
   */
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { phoneNumber },
    });
  }

  /**
   * Find a user by their provider ID
   */
  async findByProviderId(providerId: string, provider: AuthProvider): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        providerId,
        provider,
      },
    });
  }

  /**
   * Create a new user
   */
  async create(data: CreateUserDto): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Update an existing user
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a user by ID
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Find all users with optional filtering, pagination and sorting
   */
  async findAll(
    filters?: UserFilterParams,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc'
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    // Build where clause based on filters
    const where: Prisma.UserWhereInput = {};

    if (filters) {
      // Add each filter condition if provided
      if (filters.email) where.email = { contains: filters.email, mode: 'insensitive' };
      if (filters.phoneNumber) where.phoneNumber = { contains: filters.phoneNumber };
      if (filters.role) where.role = filters.role;
      if (filters.isActive !== undefined) where.isActive = filters.isActive;
      if (filters.provider) where.provider = filters.provider;
      if (filters.isEmailVerified !== undefined) where.isEmailVerified = filters.isEmailVerified;
      if (filters.isPhoneVerified !== undefined) where.isPhoneVerified = filters.isPhoneVerified;
      if (filters.twoFactorEnabled !== undefined) where.twoFactorEnabled = filters.twoFactorEnabled;

      // Handle firstName and lastName filters
      if (filters.firstName) where.firstName = { contains: filters.firstName, mode: 'insensitive' };
      if (filters.lastName) where.lastName = { contains: filters.lastName, mode: 'insensitive' };

      // Handle search across multiple fields
      if (filters.search) {
        where.OR = [
          { firstName: { contains: filters.search, mode: 'insensitive' } },
          { lastName: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const total = await prisma.user.count({ where });

    // Get users with pagination and sorting
    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Update user password
   */
  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  /**
   * Verify user email
   */
  async verifyEmail(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isEmailVerified: true },
    });
  }

  /**
   * Verify user phone
   */
  async verifyPhone(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isPhoneVerified: true },
    });
  }

  /**
   * Enable or disable two-factor authentication
   */
  async setTwoFactorEnabled(id: string, enabled: boolean, secret?: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: {
        twoFactorEnabled: enabled,
        twoFactorSecret: enabled ? secret : null,
      },
    });
  }

  /**
   * Update user role
   */
  async updateRole(id: string, role: UserRole): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  /**
   * Activate or deactivate a user
   */
  async setActiveStatus(id: string, isActive: boolean): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  /**
   * Count users by role
   */
  async countByRole(): Promise<{ role: UserRole; count: number }[]> {
    const results = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true,
      },
    });

    return results.map((result) => ({
      role: result.role,
      count: result._count.role,
    }));
  }

  /**
   * Find users created within a date range
   */
  async findByDateRange(startDate: Date, endDate: Date, page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const total = await prisma.user.count({ where });

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { users, total };
  }
}
