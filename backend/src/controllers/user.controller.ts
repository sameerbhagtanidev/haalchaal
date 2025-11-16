import User from "../models/user.model.js";
import Relation from "../models/relation.model.js";
import Message from "../models/message.model.js";

import { generateAndSetJWT, generateLoginToken } from "../utils/tokens.util.js";
import { sanitizeUser } from "../utils/sanitize.util.js";
import AppError from "../utils/AppError.util.js";
import { nanoid } from "nanoid";
import { oauth2Client } from "../config/googleAuth.config.js";

import type { Request, Response, NextFunction } from "express";

import * as schemas from "../validation/user.schema.js";
import { validateData, validateObjectIds } from "../utils/validate.util.js";
import { sendLoginEmail } from "../utils/mails.util.js";

export async function handleCheckUsername(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const validated = validateData(schemas.checkUsernameSchema, req.query);
    const { username } = validated;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.status(200).json({
            available: false,
            message: "Username is already taken",
        });
    } else {
        return res
            .status(200)
            .json({ available: true, message: "Username is available" });
    }
}

export async function handleStatus(
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (!req.user) {
        return res.status(200).json({
            success: true,
            authenticated: false,
            message: "User is not logged in.",
            data: null,
        });
    }

    return res.status(200).json({
        success: true,
        authenticated: true,
        message: "User is logged in.",
        data: {
            user: {
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
            },
        },
    });
}

export async function handleSendToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const validated = validateData(schemas.sendTokenSchema, req.body);
    const { email }: { email: string } = validated;

    const existingUser = await User.findOne({ email });

    const loginToken = generateLoginToken();

    if (process.env.SEND_MAILS === "true") {
        await sendLoginEmail(email, loginToken);
    } else {
        console.log(`${email} : ${loginToken}`);
    }

    if (existingUser) {
        existingUser.loginToken = loginToken;
        existingUser.loginTokenExpiresAt = new Date(
            Date.now() + 15 * 60 * 1000
        ); // 15 mins
        await existingUser.save();

        return res.status(201).json({
            success: true,
            message: "A login token has been sent to your email address.",
            data: {
                email: existingUser.email,
            },
        });
    }

    const newUser = new User({
        email,
        loginToken,
        loginTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins
    });
    await newUser.save();

    return res.status(201).json({
        success: true,
        message:
            "Registration successful! A login token has been sent to your email address.",
        data: {
            email: newUser.email,
        },
    });
}

export async function handleVerifyToken(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const validated = validateData(schemas.verifyTokenSchema, req.body);
    const { email, loginToken }: { email: string; loginToken: string } =
        validated;

    const user = await User.findOne({ email });

    if (!user || !user.loginToken || !user.loginTokenExpiresAt) {
        throw new AppError(404, "Invalid or expired login token!");
    }

    if (user.loginTokenExpiresAt < new Date()) {
        user.loginToken = undefined;
        user.loginTokenExpiresAt = undefined;
        await user.save();

        throw new AppError(404, "Invalid or expired login token!");
    }

    const isValid = await user.compareLoginToken(loginToken);

    if (!isValid) {
        throw new AppError(404, "Invalid or expired login token!");
    }

    user.loginToken = undefined;
    user.loginTokenExpiresAt = undefined;
    await user.save();

    generateAndSetJWT(res, user);

    return res.status(200).json({
        success: true,
        message: "User logged in successfully.",
        data: {
            user: sanitizeUser(user),
        },
    });
}

export async function handleOnboard(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const validated = validateData(schemas.onboardSchema, req.body);
    const { username } = validated;
    const email = req.user?.email;

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
        throw new AppError(400, "User with this username already exists!");
    }

    const updatedUser = await User.findOneAndUpdate(
        { email },
        { username },
        { new: true }
    );

    if (!updatedUser) {
        throw new AppError(404, "User not found");
    }

    generateAndSetJWT(res, updatedUser);

    return res.status(200).json({
        success: true,
        message: "User onboarded successfully!",
        data: {
            user: sanitizeUser(updatedUser),
        },
    });
}

export async function handleLogout(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.clearCookie("haalchaal-token");

    return res.status(200).json({
        success: true,
        message: "User logged out succesfully.",
    });
}

export async function handleGoogleLogin(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const state = nanoid(32);

    res.cookie("haalchaal-oauth-state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60 * 1000, // 5 minutes
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    const authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: ["email"],
        state: state,
    });

    return res.redirect(authUrl);
}

export async function handleGoogleCallback(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const { code, state, error } = req.query;

    const storedState = req.cookies["haalchaal-oauth-state"];
    res.clearCookie("haalchaal-oauth-state");

    if (state !== storedState || error) {
        console.error(`Google Auth error : ${error}`);
        return res.redirect(
            `${process.env.CLIENT_URL!}/error?msg=Google Login Failed`
        );
    }

    try {
        const { tokens } = await oauth2Client.getToken(code as string);
        const idToken = tokens.id_token;

        if (!idToken) {
            throw new Error("ID Token not received from Google.");
        }

        const ticket = await oauth2Client.verifyIdToken({
            idToken: idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.sub || !payload.email) {
            throw new Error("Failed to extract verified user data.");
        }

        const googleId = payload.sub;
        const email = payload.email;

        let user = await User.findOne({
            $or: [{ googleId: googleId }, { email: email }],
        });

        if (!user) {
            user = new User({
                email: email,
                googleId: googleId,
            });
            await user.save();
        } else if (!user.googleId) {
            user.googleId = googleId;
            await user.save();
        }

        generateAndSetJWT(res, user);

        return res.redirect(`${process.env.CLIENT_URL!}/chat`);
    } catch (err) {
        console.error(`Google Auth error : ${err}`);
        return res.redirect(
            `${process.env.CLIENT_URL!}/error?msg=Google Login Failed`
        );
    }
}

export async function handleDeleteUser(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = req.params.userId;
    validateObjectIds(userId);

    const existingUser = await User.findById(userId);
    if (!existingUser) {
        throw new AppError(404, "User not found");
    }

    const relResult = await Relation.deleteMany({
        $or: [{ from: userId }, { to: userId }],
    });

    const msgResult = await Message.deleteMany({
        $or: [{ from: userId }, { to: userId }],
    });

    const userResult = await User.deleteOne({ _id: userId });

    return res.status(200).json({
        success: true,
        message: "User and related data deleted successfully.",
        data: {
            userDeleted: userResult.deletedCount === 1,
            relationsDeleted: relResult.deletedCount ?? 0,
            messagesDeleted: msgResult.deletedCount ?? 0,
        },
    });
}
