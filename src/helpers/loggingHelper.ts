import { Request } from "express";

export const createErrorString = (
  message:string,
  methodName: string,
  request: Request
) => {
  const reqMetaData = getRequestMetaData(request);
  return `[[ ${methodName} ]] ${message}; metadata: ${JSON.stringify(reqMetaData)}`;
};

const getRequestMetaData = (req: Request) => ({
  body: req.body || null,
  method: req.method || null,
  params: req.params || null,
  queryParams: req.query || null
});