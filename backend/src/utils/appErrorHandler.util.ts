import type { Request, Response, NextFunction } from "express";

interface AppError extends Error {
    status: number;
}

export default function appErrorHandler(
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
): Response {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";

    console.error(err);

    return res.status(status).json({
        success: false,
        message,
    });
}
