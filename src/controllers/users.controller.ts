import { Response } from 'express';
import { Container } from 'typedi';
import { UserService } from '@services/users.service';
import { RequestWithUser } from '@/interfaces/auth.interface';
import catchAsync from '@/utils/catchAsync';
import httpStatus from 'http-status';

export class UserController {
  private user = Container.get(UserService);

  public getMe = catchAsync(async (req: RequestWithUser, res: Response): Promise<void> => {
    const user = await this.user.findUserById(req.user.id);

    res.status(httpStatus.OK).send(user);
  });
}
