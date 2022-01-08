import { Request, Response, NextFunction } from 'express';

export const errorLogger = (
  err: any,
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  console.error('\x1b[31m', err);
  next(err);
};
