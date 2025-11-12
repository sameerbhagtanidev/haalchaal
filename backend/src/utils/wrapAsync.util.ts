import type { Request, Response, NextFunction, RequestHandler } from "express";

export default function wrapAsync(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler {
    return function (req, res, next) {
        fn(req, res, next).catch(next);
    };
}
