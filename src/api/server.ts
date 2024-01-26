import express from 'express';

import morgan from 'morgan';

import cors from 'cors';

import { hostname } from 'os';

import connectDB from './database/connect';

import { initModels } from './database/models/init-models';

import v1 from './routes/v1/index';

const DEBUG = process.env.NODE_ENV === 'development';

const app = express();

// setup http logger and send limit
app.use(express.json({ limit: '10kb' }));
if (DEBUG) app.use(morgan('dev'));

app.use(
  cors({
    origin: [
      `http://localhost:${process.env.port}`,
      `http://${hostname()}:${process.env.port}`,
    ],
    credentials: true,
  }),
);

// TODO: Add API token identifier

// main API v1
app.use('/v1', v1);
app.use('/stable', v1);

// latest API release
// app.use("/latest", v2);

app.all('*', (req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});

// db setup and connect
// sequelize init models and CRUD functions
const sequelize = await connectDB(DEBUG);
await initModels(sequelize);
await sequelize.sync({ force: false });
await console.log('🛢️ Synced database successfully!');

// startup api
app.listen(process.env.port, async () => {
  const endpoint = `http://${hostname() || 'localhost'}:${process.env.port}`;
  console.log(`🚀 Server started successfully on ${endpoint}!`);
});

export default DEBUG;
