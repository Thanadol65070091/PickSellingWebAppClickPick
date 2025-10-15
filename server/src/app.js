import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import fs from 'fs';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { router as authRouter } from './routes/auth.js';
import { router as cartRouter } from './routes/cart.js';
import { router as ordersRouter } from './routes/orders.js';
import { router as productRouter } from './routes/products.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || '*';

app.use(helmet());
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.get('/',)
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api', cartRouter);
app.use('/api', ordersRouter);

// Swagger
const swaggerPath = path.join(process.cwd(), 'src', 'swagger', 'openapi.json');
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, 'utf-8'));
app.get('/api-docs.json', (_req, res) => res.json(swaggerDoc));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
