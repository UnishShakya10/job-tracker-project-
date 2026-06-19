import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import applicationsRouter from './routes/applications.router';
import { errorHandler, notFound } from './middleware/errorHandler';

const app = express();

app.use(helmet());
app.use(cors({ origin: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/applications', applicationsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
