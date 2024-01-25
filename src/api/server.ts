import express from 'express';

import morgan from 'morgan';

import cors from 'cors';

import { connectDB } from './database/connect';

import { initModels } from './database/models/init-models';

import { router } from './routes/v1/index';

const DEBUG = process.env.NODE_ENV === 'development';

const app = express();

// setup http logger and send limit
app.use(express.json({ limit: '10kb' }));
if (DEBUG) app.use(morgan('dev'));

app.use(
  cors({
    origin: ["http://localhost:3333"],
    credentials: true,
  })
);

// main API v1
app.use("/v1", router);
app.use("/stable", router);

// latest API release
// app.use("/latest", router);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});

// db setup and connect
// sequelize init models and CRUD functions
const sequelize = await connectDB(DEBUG);
await initModels(sequelize);
await sequelize.sync({ force: false });
await console.log("🛢️Synced database successfully!");

// startup api
app.listen(3333, async () => {
  console.log("🚀Server started successfully!");
});

export default DEBUG;
