import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';
import { UserFilterParams } from '../../params/user.params';
import { AuthProvider, User, UserRole } from '../../prisma/generated';

export interface IUserRepository {
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

  /**
   * Retrieves a user by their unique identifier.
   *
   * @param id - The unique identifier of the user to find.
   * @returns A promise that resolves to the user if found, or `null` if no user exists with the given id.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user if found, or `null` if no user exists with the given email.
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Finds a user by their phone number.
   *
   * @param phoneNumber - The phone number to search for.
   * @returns A promise that resolves to the user if found, or `null` if no user exists with the given phone number.
   */
  findByPhoneNumber(phoneNumber: string): Promise<User | null>;

  /**
   * Finds a user by their provider ID and authentication provider.
   *
   * @param providerId - The unique identifier assigned by the authentication provider.
   * @param provider - The authentication provider (e.g., Google, Facebook).
   * @returns A promise that resolves to the found {@link User} object, or `null` if no user is found.
   */
  findByProviderId(providerId: string, provider: AuthProvider): Promise<User | null>;

  /**
   * Creates a new user in the database.
   *
   * @param data - The data required to create a new user.
   * @returns A promise that resolves to the created User entity.
   */
  create(data: CreateUserDto): Promise<User>;

  /**
   * Updates a user's information in the database.
   *
   * @param id - The unique identifier of the user to update.
   * @param data - An object containing the fields to update for the user.
   * @returns A promise that resolves to the updated User object.
   */
  update(id: string, data: UpdateUserDto): Promise<User>;

  /**
   * Deletes a user from the database by unique identifier.
   *
   * @param id - The unique identifier of the user to delete.
   * @returns A promise that resolves to the deleted User object.
   */
  delete(id: string): Promise<User>;

  /**
   * Updates the password hash for a user with the specified ID.
   *
   * @param id - The unique identifier of the user whose password is to be updated.
   * @param passwordHash - The new hashed password to set for the user.
   * @returns A promise that resolves to the updated User object.
   */
  updatePassword(id: string, passwordHash: string): Promise<User>;

  /**
   * Marks the user's email as verified by updating the `isEmailVerified` field to `true`.
   *
   * @param id - The unique identifier of the user whose email is to be verified.
   * @returns A promise that resolves to the updated `User` object.
   */
  verifyEmail(id: string): Promise<User>;

  /**
   * Marks the user's phone number as verified by updating the `isPhoneVerified` field to `true`.
   *
   * @param id - The unique identifier of the user whose phone number is to be verified.
   * @returns A promise that resolves to the updated `User` object.
   */
  verifyPhone(id: string): Promise<User>;

  /**
   * Enables or disables two-factor authentication (2FA) for a user and optionally sets the 2FA secret.
   *
   * @param id - The unique identifier of the user.
   * @param enabled - A boolean indicating whether 2FA should be enabled (`true`) or disabled (`false`).
   * @param secret - (Optional) The secret key for 2FA. Required when enabling 2FA.
   * @returns A promise that resolves to the updated `User` object.
   */
  setTwoFactorEnabled(id: string, enabled: boolean, secret?: string): Promise<User>;

  /**
   * Updates the role of a user with the specified ID.
   *
   * @param id - The unique identifier of the user whose role is to be updated.
   * @param role - The new role to assign to the user.
   * @returns A promise that resolves to the updated user object.
   */
  updateRole(id: string, role: UserRole): Promise<User>;

  /**
   * Updates the active status of a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @param isActive - The new active status to set for the user.
   * @returns A promise that resolves to the updated User object.
   */
  setActiveStatus(id: string, isActive: boolean): Promise<User>;

  /**
   * Counts the number of users grouped by their role.
   *
   * @returns A promise that resolves to an array of objects, each containing a user role and the corresponding count of users with that role.
   */
  countByRole(): Promise<{ role: UserRole; count: number }[]>;

  /**
   * Retrieves a paginated list of users whose `createdAt` date falls within the specified date range.
   *
   * @param startDate - The start date of the range (inclusive).
   * @param endDate - The end date of the range (inclusive).
   * @param page - The page number for pagination (default is 1).
   * @param limit - The number of users to return per page (default is 10).
   * @returns A promise that resolves to an object containing the array of users and the total count of users matching the criteria.
   */
  findByDateRange(startDate: Date, endDate: Date, page: number, limit: number): Promise<{ users: User[]; total: number }>;
}
