import { Request } from "express";
import morgan, { StreamOptions } from "morgan";

import Logger from "./winstonLogger";

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
};

const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

morgan.token(
  'queryParams',
  (req: Request) => Object.keys(req.query).length ? `${JSON.stringify(req.query)}` : '',
);

morgan.token(
  'bodyParams',
  (req: Request) => Object.keys(req.body).length ? `${JSON.stringify(req.body)}` : '',
);

const morganMiddleware = morgan(
  // eslint-disable-next-line max-len
  ":method :url :queryParams :bodyParams :status :res[content-length] - :response-time ms",
  { stream, skip }
);

export default morganMiddleware;