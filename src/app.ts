import express from 'express';
import { router } from './routes/router';

const app = express();
router(app);

export default app;
