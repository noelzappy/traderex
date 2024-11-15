import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { RegisterUserDto } from '@/dtos/users.dto';

export class AuthRoute implements Routes {
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/auth/register', ValidationMiddleware(RegisterUserDto), this.auth.register);
    this.router.post('/auth/login', ValidationMiddleware(RegisterUserDto), this.auth.logIn);
    this.router.post('/auth/logout', AuthMiddleware, this.auth.logOut);
  }
}
