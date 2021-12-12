import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken';
import Logger from "../config/winstonLogger";

import { HTTP_STATUS_CODE } from "../enums/statusCodes";
import { createErrorString } from "../helpers/loggingHelper";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    Logger.error(
      createErrorString('You are not authorized','authenticateToken', req)
    );
    return res.status(HTTP_STATUS_CODE.UNAUTHORIZED)
      .json({ message: "You are not authorized" });
  }

  verify(token, process.env.TOKEN_SECRET as string, (err: any, _user: any) => {

    if (err) {
      Logger.error(
        createErrorString(err.message,'authenticateToken', req)
      );
      return res.status(HTTP_STATUS_CODE.FORBIDDEN)
        .json({ message: "Access is forbidden" });
    }

    next();
  });
};
