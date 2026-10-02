import express, { Application } from 'express';

export const router = (app: Application): void => {
  app.route('/').get((req, res) =>
    res.status(200).json({
      message: 'Server lintening',
    }),
  );

  app.use(express.json());
};
