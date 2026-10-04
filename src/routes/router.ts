import express, { Application } from 'express';

import authRouter from './auth.routes';
import usersRouter from './users.routes';
import condominiosRouter from './condominios.routes';

export const router = (app: Application): void => {
  app.route('/').get((req, res) =>
    res.status(200).json({
      message: 'Server listening',
    }),
  );

  app.use(express.json(), authRouter, usersRouter, condominiosRouter);
};
