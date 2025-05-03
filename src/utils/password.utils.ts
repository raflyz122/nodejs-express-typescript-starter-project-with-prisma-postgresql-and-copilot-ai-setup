import * as bcrypt from 'bcrypt';

export default class PasswordUtils {
  /**
   * Asynchronously generates a bcrypt hash for the provided plain text password.
   *
   * @param password - The plain text password to hash.
   * @returns A promise that resolves to the hashed password string.
   */
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  /**
   * Compares a plain text password with a hashed password to determine if they match.
   *
   * @param plainTextPassword - The plain text password to verify.
   * @param hashedPassword - The hashed password to compare against.
   * @returns A promise that resolves to `true` if the passwords match, or `false` otherwise.
   */
  static async comparePassword(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}
