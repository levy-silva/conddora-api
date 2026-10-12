import { Router } from 'express';

import { UserController } from '../modules/users/users.controller';
import { UserService } from '../modules/users/users.service';
import { authenticate } from '../middlewares/autheticate';
import { authorize } from '../middlewares/authorize';

const userService = new UserService();
const userController = new UserController(userService);

const usersRouter = Router();

usersRouter.use(authenticate);

usersRouter.post('/users', authorize(['ADMIN']), userController.create);

usersRouter.get('/users', authorize(['ADMIN']), userController.findAll);

usersRouter.get(
  '/users/:userId',
  authorize(['ADMIN']),
  userController.findById,
);

usersRouter.patch(
  '/users/:userId',
  authorize(['ADMIN']),
  userController.update,
);

usersRouter.delete(
  '/users/:userId',
  authorize(['ADMIN']),
  userController.delete,
);

export default usersRouter;
