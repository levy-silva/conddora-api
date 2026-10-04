import { Router } from 'express';
import { CondominioController } from '../modules/condominios/condominios.controller';

const condominioController = new CondominioController();

const condominiosRouter = Router();

condominiosRouter.post('/condominios', condominioController.create);
condominiosRouter.get('/condominios', condominioController.findAll);
condominiosRouter.get(
  '/condominios/:condominioId',
  condominioController.findById,
);
condominiosRouter.patch(
  '/condominios/:condominioId',
  condominioController.update,
);
condominiosRouter.delete(
  '/condominios/:condominioId',
  condominioController.delete,
);

export default condominiosRouter;
