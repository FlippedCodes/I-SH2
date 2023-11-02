// get dependencies
import express from 'express';

import { connectDB } from './database/connect';

const app = express();

const DEBUG = process.env.NODE_ENV === development;

// sequelize init models and CRUD functions

// setup endpoints
app.get("/healthcheck", (req, res) => {
  // TODO: write function to check if all services are still available
  res.status(200).json({
    status: "success",
    message: "Healthcheck successful",
  });
});

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route: ${req.originalUrl} does not exist on this server`,
  });
});

// db setup and connect
const db = await connectDB();
await db.sync({ force: false });
await console.log("✅Synced database successfully!");

// startup api
app.listen(3000, async () => {
  console.log("🚀Server started successfully!");
});
