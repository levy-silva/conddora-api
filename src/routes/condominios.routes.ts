import { Router } from 'express';

import { CondominioController } from '../modules/condominios/condominios.controller';
import { CondominioService } from '../modules/condominios/condominios.service';
import { authorize } from '../middlewares/authorize';

const condominioService = new CondominioService();
const condominioController = new CondominioController(condominioService);

const condominiosRouter = Router();

condominiosRouter.post(
  '/condominios',
  authorize(['ADMIN']),
  condominioController.create,
);

condominiosRouter.get(
  '/condominios',
  authorize(['ADMIN']),
  condominioController.findAll,
);

condominiosRouter.get(
  '/condominios/:condominioId',
  authorize(['ADMIN', 'SINDICO', 'CONDOMINO']),
  condominioController.findById,
);

condominiosRouter.patch(
  '/condominios/:condominioId',
  authorize(['ADMIN']),
  condominioController.update,
);
condominiosRouter.delete(
  '/condominios/:condominioId',
  authorize(['ADMIN']),
  condominioController.delete,
);

export default condominiosRouter;
