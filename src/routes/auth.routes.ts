import { Router } from 'express';

import { AuthController } from '../modules/auth/auth.controller';
import { AuthService } from '../modules/auth/auth.service';

const authService = new AuthService();
const authController = new AuthController(authService);

const authRouter = Router();

authRouter.post('/auth/login', authController.login);

export default authRouter;
