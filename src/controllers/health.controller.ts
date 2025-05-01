import { Request, Response } from 'express';
import container from '../config/ioc.config';
import IUnitOfService from '../services/interfaces/iunitof.service';
import { TYPES } from '../config/ioc.types';

export class HealthController {
  constructor(private unitOfService = container.get<IUnitOfService>(TYPES.IUnitOfService)) {
    this.unitOfService = unitOfService;
  }

  async check(req: Request, res: Response) {
    return res.status(200).json({ status: 'UP' });
  }
}
