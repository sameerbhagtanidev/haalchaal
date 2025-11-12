import User from "../models/user.model.js";

import { decodeJWT } from "../utils/tokens.util.js";
import AppError from "../utils/AppError.util.js";

import type { Request, Response, NextFunction } from "express";

export function getUser(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies["haalchaal-token"];

    if (!token) {
        req.user = null;
        return next();
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
        req.user = null;
        return next();
    }

    req.user = decoded;

    return next();
}

export async function requireAuth(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user) throw new AppError(401, "User is not logged in.");

    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
        throw new AppError(404, "User not found!");
    }

    req.user = user;

    return next();
}

export function requireOnboarded(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user!.username) {
        throw new AppError(401, "You haven't onboarded yet!");
    }

    return next();
}

export function requireNotOnboarded(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (req.user!.username) {
        throw new AppError(404, "You have already onboarded!");
    }

    return next();
}
