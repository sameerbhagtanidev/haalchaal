import jwt, { type JwtPayload } from "jsonwebtoken";
import crypto from "crypto";

import type { Response } from "express";
import type { IUser } from "../models/user.model.js";

interface Payload {
    _id: string;
    username: undefined | string;
    email: string;
}

export interface JwtPayloadWithData extends JwtPayload, Payload {}

export function generateAndSetJWT(res: Response, user: IUser): string | null {
    const payload: Payload = {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
    };

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const token = jwt.sign(payload, secret, {
        expiresIn: "7d",
    });

    res.cookie("haalchaal-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
}

export function decodeJWT(
    token: string | undefined | null
): JwtPayloadWithData | null {
    if (!token) return null;

    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    try {
        return jwt.verify(token, secret) as JwtPayloadWithData;
    } catch (err) {
        return null;
    }
}

export function generateLoginToken() {
    const loginToken = crypto.randomInt(100000, 1000000);
    return loginToken.toString();
}
