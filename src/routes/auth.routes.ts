import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller';

const authController = new AuthController();

const authRouter = Router();

authRouter.post('/auth/login', authController.login);

export default authRouter;
