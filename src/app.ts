import 'reflect-metadata';
import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { usersRouter } from "./api/users";
import { failSafeErrorHandler } from "./middlewares/failSafeErrorHandler";
import { joiErrorHandler } from './middlewares/joiErrorHandler';
import { errorLogger } from './middlewares/errorLogger';
import { groupsRouter } from './api/groups';

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

dotenv.config();

if (!process.env.PORT) {
  console.log('PORT was not provided!');
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

const app:express.Application = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/users/', usersRouter);
app.use('/api/v1/groups/', groupsRouter);

app.use(errorLogger);
app.use(joiErrorHandler);
app.use(failSafeErrorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

