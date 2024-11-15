import { sign, verify } from 'jsonwebtoken';
import Container, { Service } from 'typedi';
import { SECRET_KEY } from '@config';
import { DataStoredInToken, TokenData, TokenObj } from '@interfaces/auth.interface';
import httpStatus from 'http-status';
import { UserService } from './users.service';
import { Token, TokenType, User } from '@prisma/client';
import prisma from '@/database';
import { HttpException } from '@/utils/HttpException';

type GenerateTokenBody = {
  expires?: number;
  userId: number;
  type: TokenType;
  phone?: string;
  otp?: string;
};

@Service()
export class TokenService {
  public _users = Container.get(UserService);

  generateToken = ({ expires, userId, type, phone }: GenerateTokenBody): string => {
    const dataStoredInToken: DataStoredInToken = {
      sub: userId,
      iat: Date.now(),
      exp: expires || Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      type,
    };

    return sign(dataStoredInToken, SECRET_KEY);
  };

  private generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  public async saveToken(tokenBody: TokenData): Promise<Token> {
    tokenBody.expiresAt = tokenBody.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    return prisma.token.create({
      data: tokenBody,
    });
  }

  public async verifyToken(token: string, type: TokenType) {
    const payload = verify(token, SECRET_KEY) as unknown as DataStoredInToken;

    const tokenData = await prisma.token.findFirst({
      where: {
        token,
        type,
        userId: payload.sub,
        expiresAt: new Date(payload.exp),
      },
    });

    if (!tokenData) {
      throw new HttpException(httpStatus.UNAUTHORIZED, 'Token not found or expired');
    }

    return tokenData;
  }

  public async generateAuthTokens(user: User): Promise<{
    access: TokenObj;
    refresh: TokenObj;
  }> {
    const tokenExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    const accessToken = this.generateToken({
      userId: user.id,
      type: TokenType.access,
      expires: tokenExpires.getTime(),
    });
    const refreshTokenExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    const refreshToken = this.generateToken({
      userId: user.id,
      type: TokenType.refresh,
      expires: refreshTokenExpires.getTime(),
    });

    await this.saveToken({
      token: accessToken,
      userId: user.id,
      expiresAt: tokenExpires,
      type: TokenType.access,
    });
    await this.saveToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshTokenExpires,
      type: TokenType.refresh,
    });

    return {
      access: { token: accessToken, expires: tokenExpires },
      refresh: { token: refreshToken, expires: refreshTokenExpires },
    };
  }

  public async generateResetPasswordToken(email: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new HttpException(httpStatus.NOT_FOUND, 'User not found');
    }

    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const token = this.generateToken({
      userId: user.id,
      type: TokenType.resetpassword,
      expires: expires.getTime(),
    });

    await this.saveToken({ token, userId: user.id, expiresAt: expires, type: TokenType.resetpassword });

    return token;
  }

  public async generateVerifyEmailToken(user: User): Promise<string> {
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    const token = this.generateToken({
      userId: user.id,
      type: TokenType.verifyemail,
      expires: expires.getTime(),
    });

    await this.saveToken({ token, userId: user.id, expiresAt: expires, type: TokenType.verifyemail });

    return token;
  }
}
