import { IUserRepository } from './iuser.repository';

export default interface IUnitOfWork {
  User: IUserRepository;
}
