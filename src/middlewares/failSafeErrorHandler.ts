import { Request, Response, NextFunction } from 'express';

export const failSafeErrorHandler = (
    err: any,
    _req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: NextFunction,
) => {
    res.status(500).json({ error: err.message });
};
