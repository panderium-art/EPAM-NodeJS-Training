import { NextFunction, Request, Response } from "express";
import Logger from "../config/winstonLogger";
import { HTTP_STATUS_CODE } from "../enums/statusCodes";
import { createErrorString } from "../helpers/loggingHelper";
import { generateAccessToken } from "../services/authenticationService";

type AuthenticationPayload = {
  username: string,
  password?: string,
}

export const authenticateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload: AuthenticationPayload = req.body;
    const token = generateAccessToken(
      payload.username,
      process.env.TOKEN_SECRET as string
    );
    Logger.info(`Access token = ${token}`);
    res.status(HTTP_STATUS_CODE.OK).json({ accessToken: token });
  } catch (error: any) {
    Logger.error(createErrorString(error.message, 'authenticationHandler', req));
    next(error);
  }
};