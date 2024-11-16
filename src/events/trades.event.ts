import { logger } from '@/utils/logger';
import { ScheduledTrade } from '@prisma/client';

export const onTradeScheduleCreated = async (scheduledTrade: ScheduledTrade) => {
  try {
    console.log('Trade scheduled:', scheduledTrade);
  } catch (error) {
    logger.error(error);
  }
};
