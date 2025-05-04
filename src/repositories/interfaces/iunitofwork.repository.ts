import { IUserRepository } from './iuser.repository';
import { Prisma } from '../../prisma/generated';

export default interface IUnitOfWork {
  User: IUserRepository;

  /**
   * Executes a set of operations within a database transaction.
   *
   * @param callback - A function that receives a Prisma transaction client and performs database operations.
   * @returns A promise that resolves to the result of the transaction.
   */
  transaction<T>(callback: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T>;
}
