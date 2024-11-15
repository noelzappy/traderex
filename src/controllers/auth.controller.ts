import { Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { AuthService } from '@services/auth.service';
import catchAsync from '@/utils/catchAsync';
import { LoginUserDto, RegisterUserDto, ReqWithRefreshToken } from '@/dtos/users.dto';
import httpStatus from 'http-status';
import { UserService } from '@/services/users.service';
import { TokenService } from '@/services/token.service';

export class AuthController {
  public auth = Container.get(AuthService);
  public userService = Container.get(UserService);
  public token = Container.get(TokenService);

  public register = catchAsync(async (req: Request, res: Response) => {
    const userData: RegisterUserDto = req.body;

    const signedUpUser = await this.auth.signup(userData);

    res.status(httpStatus.CREATED).send(signedUpUser);
  });

  public logIn = catchAsync(async (req: Request, res: Response) => {
    const userData: LoginUserDto = req.body;
    const loginData = await this.auth.login(userData);

    res.status(httpStatus.OK).send(loginData);
  });

  public logOut = catchAsync(async (req: RequestWithUser, res: Response) => {
    const userData = req.user;
    const body: ReqWithRefreshToken = req.body;
    await this.auth.logout(userData.id as any, body.refreshToken);
    res.sendStatus(httpStatus.NO_CONTENT);
  });

  public refreshAuth = catchAsync(async (req: Request, res: Response) => {
    const body: ReqWithRefreshToken = req.body;
    const tokenData = await this.auth.refreshAuth(body.refreshToken);
    res.status(httpStatus.OK).send(tokenData);
  });
}
