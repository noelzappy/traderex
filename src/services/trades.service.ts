import { Service } from 'typedi';
import { Prisma, ScheduledTrade, Trades } from '@prisma/client';
import prisma from '@/database';
import paginate, { PaginatedOptions } from '@/utils/paginate';
import eventManager, { EventTypes } from '@/events/eventManager';

@Service()
export class TradesService {
  public async scheduleTrade(tradeData: Prisma.ScheduledTradeCreateInput): Promise<ScheduledTrade> {
    const trade = await prisma.scheduledTrade.create({
      data: tradeData,
    });
    eventManager.emit(EventTypes.SCHEDULED_TRADE_CREATED, trade);
    return trade;
  }

  public async findScheduledTradeById(id: number): Promise<ScheduledTrade | null> {
    return prisma.scheduledTrade.findUnique({
      where: { id },
    });
  }

  public queryScheduledTrades(query: Prisma.ScheduledTradeFindManyArgs, options: PaginatedOptions) {
    return paginate<ScheduledTrade>('ScheduledTrade', query, options);
  }

  public async updateScheduledTrade(id: number, tradeData: Prisma.ScheduledTradeUpdateInput): Promise<ScheduledTrade> {
    return prisma.scheduledTrade.update({
      where: { id },
      data: tradeData,
    });
  }

  public async deleteScheduledTrade(id: number): Promise<ScheduledTrade> {
    return prisma.scheduledTrade.delete({
      where: { id },
    });
  }

  public async createTrade(tradeData: Prisma.TradesCreateInput): Promise<Trades> {
    return prisma.trades.create({
      data: tradeData,
    });
  }

  public async findTradeById(id: number): Promise<Trades | null> {
    return prisma.trades.findUnique({
      where: { id },
    });
  }

  public queryTrades(query: Prisma.TradesFindManyArgs, options: PaginatedOptions) {
    return paginate<Trades>('Trades', query, options);
  }

  public async updateTrade(id: number, tradeData: Prisma.TradesUpdateInput): Promise<Trades> {
    return prisma.trades.update({
      where: { id },
      data: tradeData,
    });
  }

  public async closeTrade(id: number): Promise<Trades> {
    return prisma.trades.update({
      where: { id },
      data: {
        status: 'closed',
      },
    });
  }
}
