'use strict';

import express from 'express';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import { userContext, logger, errorHandler } from 'common-node-lib';
import dotenv from 'dotenv';
import os from 'os';

import { serviceConfig } from './constants.js';
import routes from './routes/index.js';
import { testConnection } from './utils/index.js';

dotenv.config({
  path: './env',
});

const log = logger('service-gateway');

const app = express();

// Initialize App
log.debug('App middleware initialization');
app.use(
  express.json({
    limit: process.env.PAYLOAD_SIZE_LIMIT || '1mb',
  })
);

app.use(
  express.urlencoded({
    limit: process.env.URL_PAYLOAD_LIMIT || '64kb',
    extended: false,
  })
);

app.use(
  cors({
    origin: process.env.ORIGIN_PATH,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(
  rateLimit({
    windowMs: Number(process.env.WINDOW_SIZE) || 5 * 60 * 1000,
    limit: Number(process.env.API_LIMIT) || 100,
  })
);

// Global user context middleware initialized
app.use(userContext);

// Global Routes Definition
app.use('/', routes.redirectAPIRoutes);

app.use(errorHandler);

const HOST = process.env.HOST || serviceConfig.HOST;
const PORT = process.env.PORT || serviceConfig.PORT;
const PROTOCOL = process.env.PROTOCOL || serviceConfig.PROTOCOL;

app.listen(PORT, HOST, () => {
  log.info(`Service Gateway is running on port : ${PORT}`);
  log.info(`Uptime : ${process.uptime()} seconds | Timestamp : ${Date.now()} | Hostname : ${os.hostname()}`);
});

testConnection(PROTOCOL, PORT);
