import { NextFunction, Response } from 'express';
import { RequestWithUser } from '@interfaces/auth.interface';
import httpStatus from 'http-status';
import passport from 'passport';
import { User } from '@prisma/client';
import { HttpException } from '@/utils/HttpException';

const AUTH_ERR_MSG = 'Please authenticate';

const verifyCallback = (req: RequestWithUser, resolve, reject) => async (err, user: User, info) => {
  if (err || info || !user) {
    return reject(new HttpException(httpStatus.UNAUTHORIZED, AUTH_ERR_MSG));
  }

  req.user = user;

  resolve();
};

export const AuthMiddleware = () => async (req: RequestWithUser, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};
