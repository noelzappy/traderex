import { hash, compare } from 'bcrypt';
import Container, { Service } from 'typedi';
import { TokenObj } from '@interfaces/auth.interface';
import httpStatus from 'http-status';
import { TokenService } from './token.service';
import { LoginUserDto, RegisterUserDto } from '@/dtos/users.dto';
import { TokenType, User } from '@prisma/client';
import prisma from '@/database';
import { HttpException } from '@/utils/HttpException';

@Service()
export class AuthService {
  public Token = Container.get(TokenService);

  public async signup(userData: RegisterUserDto): Promise<{
    tokenData: {
      access: TokenObj;
      refresh: TokenObj;
    };
    user: User;
  }> {
    const emailUser = await prisma.user.findUnique({ where: { email: userData.email?.toLowerCase() } });

    if (emailUser) throw new HttpException(httpStatus.BAD_REQUEST, 'Email already taken');

    const hashedPassword = await hash(userData.password, 10);

    await prisma.user.create({
      data: { ...userData, password: hashedPassword, email: userData.email?.toLowerCase() },
    });

    const createdUser = await prisma.user.findUnique({
      where: { email: userData.email },
    });

    const tokenData = await this.Token.generateAuthTokens(createdUser as User);

    return { tokenData, user: createdUser };
  }

  public async login(userData: LoginUserDto): Promise<{
    tokenData: {
      access: TokenObj;
      refresh: TokenObj;
    };
    user: User;
  }> {
    const findUser = await prisma.user.findUnique({ where: { email: userData.email.toLowerCase() } });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);

    if (!isPasswordMatching) throw new HttpException(httpStatus.UNAUTHORIZED, 'Incorrect email or password');

    delete findUser.password;

    const tokenData = await this.Token.generateAuthTokens(findUser);

    return { tokenData, user: findUser };
  }

  public async logout(userId: number, refreshToken: string): Promise<void> {
    await prisma.token.deleteMany({ where: { token: refreshToken, type: TokenType.refresh, userId } });
    await prisma.token.deleteMany({ where: { userId, type: TokenType.access } });
  }

  public async refreshAuth(refreshToken: string): Promise<{
    access: TokenObj;
    refresh: TokenObj;
  }> {
    const verifiedToken = await this.Token.verifyToken(refreshToken, TokenType.refresh);

    if (!verifiedToken) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const findUser = await prisma.user.findUnique({
      where: {
        id: verifiedToken.userId,
      },
    });

    if (!findUser) throw new HttpException(httpStatus.UNAUTHORIZED, 'Invalid token');

    const tokenData = await this.Token.generateAuthTokens(findUser);

    return tokenData;
  }
}
