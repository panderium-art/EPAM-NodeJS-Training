import { Request, Response } from 'express';
import Logger from '../config/winstonLogger';
import { HTTP_STATUS_CODE } from '../enums/statusCodes';

export const failSafeErrorHandler = (
  err: any,
  _req: Request,
  res: Response,
) => {
  Logger.error(`[[ FAIL SAFE ERROR HANDLING ]] ${err.message}`);
  res.status(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
};
