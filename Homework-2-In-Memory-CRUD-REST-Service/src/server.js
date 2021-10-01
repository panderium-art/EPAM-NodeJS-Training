import * as dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { usersRouter } from './routers/userRouter.js';
import { errorHandler } from './error.js';

dotenv.config();

if (!process.env.PORT) {
    console.log('PORT was not provided!');
    process.exit(1);
}

const PORT = parseInt(process.env.PORT, 10);

// TODO add logging
// TODO add postman scripts and requests collection for tests
const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v1/users/', usersRouter);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
