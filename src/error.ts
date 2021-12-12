import { HTTP_STATUS_CODE } from "./enums/statusCodes";

export class AppError extends Error {
  status: HTTP_STATUS_CODE;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Error.captureStackTrace(this);
  }
}