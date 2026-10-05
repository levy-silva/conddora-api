import express from 'express';

import { errorHandler } from './middlewares/error.handler';
import { notFound } from './middlewares/notfound';
import { router } from './routes/router';

const app = express();
router(app);

app.use(notFound);

app.use(errorHandler);

export default app;
