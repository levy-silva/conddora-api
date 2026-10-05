import { Router } from 'express';

import { UserController } from '../modules/users/users.controller';
import { UserService } from '../modules/users/users.service';
import { authenticate } from '../middlewares/autheticate';

const userService = new UserService();
const userController = new UserController(userService);

const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.post('/users', userController.create);
usersRouter.get('/users', userController.findAll);
usersRouter.get('/users/:userId', userController.findById);
usersRouter.patch('/users/:userId', userController.update);
usersRouter.delete('/users/:userId', userController.delete);

export default usersRouter;
