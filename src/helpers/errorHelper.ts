import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientRustPanicError,
  PrismaClientInitializationError,
  PrismaClientValidationError
} from "@prisma/client/runtime";
import { HTTP_STATUS_CODE } from "../enums/statusCodes";
import { AppError } from "../error";

const NOT_FOUND_ERROR_CODES = ['P2001', 'P2018', 'P2025'];
const BAD_REQUEST_ERROR_CODES = [
  'P2002',
  'P2003',
  'P2004',
  'P2005',
  'P2006',
  'P2007',
  'P2008',
  'P2009',
  'P2010',
  'P2011',
  'P2012',
  'P2013',
  'P2014',
  'P2015',
  'P2016',
  'P2017',
  'P2019',
  'P2020',
  'P2021',
  'P2022',
  'P2023',
  'P2024',
  'P2026',
  'P2027',
];

const REJECT_ON_NOT_FOUND_ERROR_NAME = 'NotFoundError';

export const prismaErrorHandler = (error: any) => {
  const internalServerError = error instanceof PrismaClientUnknownRequestError
  || error instanceof PrismaClientRustPanicError
  || error instanceof PrismaClientInitializationError;

  const knownRequestError = error instanceof PrismaClientKnownRequestError;
  const clientValidationError = error instanceof PrismaClientValidationError;

  if (internalServerError) {
    return new AppError(HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR, error.message);
  }

  if (clientValidationError) {
    return new AppError(HTTP_STATUS_CODE.BAD_REQUEST, error.message);
  }

  if (knownRequestError) {
    if(NOT_FOUND_ERROR_CODES.includes(error.code)) {
      return new AppError(HTTP_STATUS_CODE.NOT_FOUND, error.message);
    }
    if(BAD_REQUEST_ERROR_CODES.includes(error.code)) {
      return new AppError(HTTP_STATUS_CODE.BAD_REQUEST, error.message);
    }
  }

  if (error?.name === REJECT_ON_NOT_FOUND_ERROR_NAME) {
    return new AppError(HTTP_STATUS_CODE.NOT_FOUND, error.message);
  }
};
