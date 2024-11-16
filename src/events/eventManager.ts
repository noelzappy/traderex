import EventEmitter from 'events';
import { onTradeScheduleCreated } from './trades.event';

export enum EventTypes {
  TRADE_CREATED = 'TRADE_CREATED',
  TRADE_UPDATED = 'TRADE_UPDATED',
  TRADE_DELETED = 'TRADE_DELETED',
  SCHEDULED_TRADE_CREATED = 'SCHEDULED_TRADE_CREATED',
  SCHEDULED_TRADE_UPDATED = 'SCHEDULED_TRADE_UPDATED',
  SCHEDULED_TRADE_DELETED = 'SCHEDULED_TRADE_DELETED',
  USER_CREATED = 'USER_CREATED',
  USER_UPDATED = 'USER_UPDATED',
  USER_DELETED = 'USER_DELETED',
  PASSWORD_RESET = 'PASSWORD_RESET',
  PASSWORD_FORGOT = 'PASSWORD_FORGOT',
}

export interface Event {
  type: EventTypes;
  payload: any;
}

class EventManager extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(100);
    this.initEventListeners();
  }

  initEventListeners() {
    console.log('Event listeners initialized');
    this.on(EventTypes.SCHEDULED_TRADE_CREATED, onTradeScheduleCreated);
  }
}

const eventManager = new EventManager();

export default eventManager;
