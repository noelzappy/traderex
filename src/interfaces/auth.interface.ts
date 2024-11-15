import { TokenType, User } from '@prisma/client';
import { Request } from 'express';

export interface DataStoredInToken {
  sub: number;
  iat: number;
  exp: number;
  type: TokenType;
}

export interface TokenData {
  token: string;
  expiresAt: Date;
  userId: number;
  type: TokenType;
}

export interface TokenObj {
  token: string;
  expires: Date;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface RequestWithUserAndFile extends RequestWithUser {
  file: any;
  files: any[];
}
