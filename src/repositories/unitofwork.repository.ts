import container from '../config/ioc.config';
import { TYPES } from '../config/ioc.types';
import IUnitOfWork from './interfaces/iunitofwork.repository';
import { IUserRepository } from './interfaces/iuser.repository';

export default class UnitOfWork implements IUnitOfWork {
  public User: IUserRepository;
  constructor(user = container.get<IUserRepository>(TYPES.IUserRepository)) {
    this.User = user;
  }
}
