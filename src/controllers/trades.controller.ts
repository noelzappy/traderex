import { Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@/interfaces/auth.interface';
import catchAsync from '@/utils/catchAsync';
import httpStatus from 'http-status';
import { TradesService } from '@/services/trades.service';
import { CreateTradeScheduleDto } from '@/dtos/misc.dto';
import { Prisma } from '@prisma/client';

export class TradesController {
  private tradeService = Container.get(TradesService);

  public scheduleTrade = catchAsync(async (req: RequestWithUser, res: Response): Promise<void> => {
    const body: CreateTradeScheduleDto = req.body;

    const createBody: Prisma.ScheduledTradeCreateInput = {
      symbol: body.symbol,
      quantity: body.quantity,
      riskRewardRatio: body.riskRewardRatio,
      validUntil: body.validUntil ? new Date(body.validUntil) : undefined,
      user: {
        connect: {
          id: req.user.id,
        },
      },
    };

    const trade = await this.tradeService.scheduleTrade(createBody);
    res.status(httpStatus.CREATED).json(trade);
  });
}
