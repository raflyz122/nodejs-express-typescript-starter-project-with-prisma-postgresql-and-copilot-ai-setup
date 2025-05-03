import { UpdateUserDto, UserDto } from '../../dtos/user.dto';
import { CreateUserModel } from '../../models/user.model';
import { AuthProvider, User, UserRole } from '../../prisma/generated';

export interface IUserService {
  /**
   * Retrieves a user by unique identifier.
   *
   * @param id - The unique identifier of the user to retrieve.
   * @returns A promise that resolves to a `UserDto` if the user is found, or `null` if not found.
   */
  findById(id: string): Promise<UserDto | null>;

  /**
   * Retrieves a user by email address.
   *
   * @param email - The email address of the user to find.
   * @param includePassword - Optional. Whether to include the user's password in the returned DTO. Defaults to false.
   * @returns A promise that resolves to a UserDto if the user is found, or null otherwise.
   */
  findByEmail(email: string, includePassword?: boolean): Promise<UserDto | null>;

  /**
   * Finds a user by phone number.
   *
   * @param phoneNumber - The phone number to search for.
   * @returns A promise that resolves to a UserDto if a user is found, or null otherwise.
   */
  findByPhoneNumber(phoneNumber: string): Promise<UserDto | null>;

  /**
   * Finds a user by provider ID and authentication provider.
   *
   * @param providerId - The unique identifier assigned by the authentication provider.
   * @param provider - The authentication provider (e.g., Google, Facebook).
   * @returns A promise that resolves to a `UserDto` if a matching user is found, or `null` otherwise.
   */
  findByProviderId(providerId: string, provider: AuthProvider): Promise<UserDto | null>;

  /**
   * Creates a new user with the specified data and role.
   *
   * @param data - The user data required for creation, including email, password, and personal details.
   * @param role - The role to assign to the new user.
   * @returns A promise that resolves to the created user's DTO, or null if creation fails.
   */
  create(data: CreateUserModel, role: UserRole): Promise<UserDto | null>;

  /**
   * Updates a user's information by unique identifier.
   *
   * @param id - The unique identifier of the user to update.
   * @param data - The data to update the user with, conforming to the UpdateUserDto.
   * @returns A promise that resolves to the updated user's DTO, or null if the user was not found.
   */
  update(id: string, data: UpdateUserDto): Promise<UserDto | null>;

  /**
   * Deletes a user by their unique identifier.
   *
   * @param id - The unique identifier of the user to delete.
   * @returns A promise that resolves to the deleted user's DTO if found and deleted, or null if no user was found with the given id.
   */
  delete(id: string): Promise<UserDto | null>;

  /**
   * Converts a User entity to a UserDto object.
   *
   * @param user - The User entity to convert.
   * @param includePassword - Optional. If true, includes the user's password hash in the DTO; otherwise, omits it. Defaults to false.
   * @returns The UserDto representation of the given User entity.
   */
  convertToDto(user: User, includePassword: boolean): UserDto;
}
