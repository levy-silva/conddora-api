import { Request, Response, NextFunction } from 'express';

import { AuthService } from './auth.service';
import { authLoginDTO } from './auth.dtos';

export class AuthController {
  constructor(private readonly authService: AuthService) {}

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = authLoginDTO.parse(req.body);

    try {
      const { accesstoken } = await this.authService.login(email, password);

      return res.status(200).json({
        status: 200,
        accesstoken,
      });
    } catch (error) {
      next(error);
    }
  };
}
