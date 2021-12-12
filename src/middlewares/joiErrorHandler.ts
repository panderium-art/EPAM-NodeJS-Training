import { Request, Response, NextFunction } from 'express';
import { ExpressJoiError } from "express-joi-validation";
import Logger from '../config/winstonLogger';

export enum ContainerTypes {
    Body = 'body',
    Query = 'query',
    Headers = 'headers',
    Fields = 'fields',
    Params = 'params'
}

export const joiErrorHandler = (
  err: never | ExpressJoiError,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  const isJoiError = err && Object.values(ContainerTypes).includes(err.type);
  if (isJoiError) {
    Logger.error(`[[ Joi Validation Error ]] ${JSON.stringify(err.error)}`);
    const e: ExpressJoiError = err;
    res.status(400).json({
      message: `💥 Validation errors in request ${e.type}`,
      errors: e?.error?.details.map(item => ({
        field: item?.context?.key,
        description: item.message
      }))
    });
  } else {
    next(err);
  }
};