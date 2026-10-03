import express from 'express';
import { router } from './routes/router';
import { errorHandler } from './middlewares/error.handler';

const app = express();
router(app);

app.use(errorHandler);

export default app;
