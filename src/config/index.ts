import { config } from 'dotenv';
config({});

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, BINANCE_API_KEY, BINANCE_API_SECRET } = process.env;
