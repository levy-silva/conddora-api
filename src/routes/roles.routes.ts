import { Router } from 'express';

import { RoleController } from '../modules/roles/roles.controller';
import { authorize } from '../middlewares/authorize';

const roleController = new RoleController();

const rolesRouter = Router();

rolesRouter.post('/roles', authorize(['ADMIN']), roleController.create);

rolesRouter.get('/roles', authorize(['ADMIN']), roleController.findAll);

rolesRouter.get(
  '/roles/:roleId',
  authorize(['ADMIN']),
  roleController.findById,
);

rolesRouter.patch(
  '/roles/:roleId',
  authorize(['ADMIN']),
  roleController.update,
);

rolesRouter.delete(
  '/roles/:roleId',
  authorize(['ADMIN']),
  roleController.delete,
);

export default rolesRouter;
