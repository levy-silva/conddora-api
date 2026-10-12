import express, { Application } from 'express';

import condominiosRouter from './condominios.routes';
import usersRouter from './users.routes';
import rolesRouter from './roles.routes';
import authRouter from './auth.routes';

export const router = (app: Application): void => {
  app.route('/').get((req, res) =>
    res.status(200).json({
      message: 'Server listening',
    }),
  );

  app.use(
    '/api',
    express.json(),
    authRouter,
    usersRouter,
    condominiosRouter,
    rolesRouter,
  );
};
