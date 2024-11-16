import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@/middlewares/auth.middleware';
import { TradesController } from '@/controllers/trades.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateTradeScheduleDto } from '@/dtos/misc.dto';

export class TradesRoute implements Routes {
  public router = Router();
  public controller = new TradesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/trades/schedule', AuthMiddleware(), ValidationMiddleware(CreateTradeScheduleDto, 'body'), this.controller.scheduleTrade);
  }
}
