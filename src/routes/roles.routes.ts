import { Router } from 'express';
import { RoleController } from '../modules/roles/roles.controller';

const roleController = new RoleController();

const rolesRouter = Router();

rolesRouter.post('/roles', roleController.create);
rolesRouter.get('/roles', roleController.findAll);
rolesRouter.get('/roles/:roleId', roleController.findById);
rolesRouter.patch('/roles/:roleId', roleController.update);
rolesRouter.delete('/roles/:roleId', roleController.delete);

export default rolesRouter;
