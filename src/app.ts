import 'reflect-metadata';
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { usersRouter } from "./api/users";
import { failSafeErrorHandler } from "./middlewares/failSafeErrorHandler";
import { joiErrorHandler } from './middlewares/joiErrorHandler';
import { groupsRouter } from './api/groups';
import Logger from './config/winstonLogger';
import morganLogger from './config/morganLogger';
import { authenticateHandler } from './api/authenticate';

process.on('unhandledRejection', err => {
  Logger.error(err);
  process.exit(1);
});

process.on('uncaughtException', err => {
  Logger.error(err);
  process.exit(1);
});

dotenv.config();

export const app:express.Application = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morganLogger);

app.use('/api/v1/authenticate/', authenticateHandler);

app.use('/api/v1/users/', usersRouter);
app.use('/api/v1/groups/', groupsRouter);

app.use(joiErrorHandler);
app.use(failSafeErrorHandler);


