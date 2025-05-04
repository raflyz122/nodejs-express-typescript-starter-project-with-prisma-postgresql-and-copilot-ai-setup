import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import IUnitOfWork from './interfaces/iunitofwork.repository';
import { IUserRepository } from './interfaces/iuser.repository';
import prisma from '../prisma';
import { Prisma } from '../prisma/generated';

export default class UnitOfWork implements IUnitOfWork {
  public User: IUserRepository;
  constructor(user = container.get<IUserRepository>(TYPES.IUserRepository)) {
    this.User = user;
  }

  /**
   * Executes a set of operations within a database transaction.
   *
   * @param callback - A function that receives a Prisma transaction client and performs database operations.
   * @returns A promise that resolves to the result of the transaction.
   */
  async transaction<T>(callback: (prisma: Prisma.TransactionClient) => Promise<T>): Promise<T> {
    return prisma.$transaction(async (transactionClient) => {
      return callback(transactionClient);
    });
  }
}
