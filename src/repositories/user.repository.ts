import prisma from '../prisma';
import { CreateUserDto, UpdateUserDto } from '../dtos/user.dto';
import { UserFilterParams } from '../params/user.params';
import { AuthProvider, Prisma, User, UserRole } from '../prisma/generated';
import { IUserRepository } from './interfaces/iuser.repository';

export class UserRepository implements IUserRepository {
  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user to find.
   * @returns A promise that resolves to the user if found, or `null` if no user exists with the given id.
   */
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user if found, or `null` if no user exists with the given email.
   */
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });
  }

  /**
   * Finds a user by their phone number.
   *
   * @param phoneNumber - The phone number to search for.
   * @returns A promise that resolves to the user if found, or `null` if no user exists with the given phone number.
   */
  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        phoneNumber: {
          equals: phoneNumber,
          mode: 'insensitive',
        },
      },
    });
  }

  /**
   * Finds a user by their provider ID and authentication provider.
   *
   * @param providerId - The unique identifier assigned by the authentication provider.
   * @param provider - The authentication provider (e.g., Google, Facebook).
   * @returns A promise that resolves to the found {@link User} object, or `null` if no user is found.
   */
  async findByProviderId(providerId: string, provider: AuthProvider): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        providerId: {
          equals: providerId,
          mode: 'insensitive',
        },
        provider,
      },
    });
  }

  /**
   * Creates a new user in the database.
   *
   * @param data - The data required to create a new user.
   * @returns A promise that resolves to the created User entity.
   */
  async create(data: CreateUserDto): Promise<User> {
    return prisma.user.create({
      data,
    });
  }

  /**
   * Updates a user's information in the database.
   *
   * @param id - The unique identifier of the user to update.
   * @param data - An object containing the fields to update for the user.
   * @returns A promise that resolves to the updated User object.
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Deletes a user from the database by unique identifier.
   *
   * @param id - The unique identifier of the user to delete.
   * @returns A promise that resolves to the deleted User object.
   */
  async delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Retrieves a paginated list of users from the database, applying optional filters, sorting, and search criteria.
   *
   * @param filters - Optional filtering parameters to narrow down the user results. Supports filtering by email, phone number, role, active status, provider, email/phone verification status, two-factor authentication, first name, last name, and a general search across first name, last name, and email.
   * @param page - The page number for pagination (default is 1).
   * @param limit - The number of users to return per page (default is 10).
   * @param sortBy - The field by which to sort the results (default is 'createdAt').
   * @param sortOrder - The order of sorting, either 'asc' for ascending or 'desc' for descending (default is 'desc').
   * @returns An object containing the list of users, total count, current page, limit per page, and total number of pages.
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
   * Updates the password hash for a user with the specified ID.
   *
   * @param id - The unique identifier of the user whose password is to be updated.
   * @param passwordHash - The new hashed password to set for the user.
   * @returns A promise that resolves to the updated User object.
   */
  async updatePassword(id: string, passwordHash: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  /**
   * Marks the user's email as verified by updating the `isEmailVerified` field to `true`.
   *
   * @param id - The unique identifier of the user whose email is to be verified.
   * @returns A promise that resolves to the updated `User` object.
   */
  async verifyEmail(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isEmailVerified: true },
    });
  }

  /**
   * Marks the user's phone number as verified by updating the `isPhoneVerified` field to `true`.
   *
   * @param id - The unique identifier of the user whose phone number is to be verified.
   * @returns A promise that resolves to the updated `User` object.
   */
  async verifyPhone(id: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isPhoneVerified: true },
    });
  }

  /**
   * Enables or disables two-factor authentication (2FA) for a user and optionally sets the 2FA secret.
   *
   * @param id - The unique identifier of the user.
   * @param enabled - A boolean indicating whether 2FA should be enabled (`true`) or disabled (`false`).
   * @param secret - (Optional) The secret key for 2FA. Required when enabling 2FA.
   * @returns A promise that resolves to the updated `User` object.
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
   * Updates the role of a user with the specified ID.
   *
   * @param id - The unique identifier of the user whose role is to be updated.
   * @param role - The new role to assign to the user.
   * @returns A promise that resolves to the updated user object.
   */
  async updateRole(id: string, role: UserRole): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }

  /**
   * Updates the active status of a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @param isActive - The new active status to set for the user.
   * @returns A promise that resolves to the updated User object.
   */
  async setActiveStatus(id: string, isActive: boolean): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }

  /**
   * Counts the number of users grouped by their role.
   *
   * @returns A promise that resolves to an array of objects, each containing a user role and the corresponding count of users with that role.
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
   * Retrieves a paginated list of users whose `createdAt` date falls within the specified date range.
   *
   * @param startDate - The start date of the range (inclusive).
   * @param endDate - The end date of the range (inclusive).
   * @param page - The page number for pagination (default is 1).
   * @param limit - The number of users to return per page (default is 10).
   * @returns A promise that resolves to an object containing the array of users and the total count of users matching the criteria.
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
