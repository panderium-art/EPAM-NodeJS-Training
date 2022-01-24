import { app } from "./app";
import Logger from "./config/winstonLogger";

if (!process.env.PORT) {
  Logger.error('PORT was not provided!');
  process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string, 10);

app.listen(PORT, () => {
  Logger.info(`Listening on port ${PORT}`);
});