import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Relation from "../models/relation.model.js";

import { saveMessage, markRead } from "../services/message.service.js";

import type { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError.util.js";
import generateChatId from "../utils/generateChatId.util.js";
import { sanitizeMessage } from "../utils/sanitize.util.js";

import { validateObjectIds } from "../utils/validate.util.js";

export async function handleSendMessage(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const fromId = String(req.user!._id);
    const { toId, text } = req.body;

    const msg = await saveMessage(fromId, toId, text);

    return res.status(201).json({
        success: true,
        message: "Message sent successfully.",
        data: {
            message: sanitizeMessage(msg),
        },
    });
}

export async function handleGetConversation(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const otherId = req.params.otherId;
    validateObjectIds(otherId);

    const userId = String(req.user!._id);

    if (userId === otherId) {
        throw new AppError(400, "Invalid ID of other user");
    }

    const otherUser = await User.findById(otherId);
    if (!otherUser) {
        throw new AppError(404, "Friend not found");
    }

    const relation = await Relation.findOne({
        $or: [
            { from: userId, to: otherId },
            { from: otherId, to: userId },
        ],
        status: "accepted",
    });
    if (!relation) {
        throw new AppError(403, "You're not friends with the other user.");
    }

    const chatId = generateChatId(userId, otherId);

    const limit = Number(req.query.limit) || 20;
    const cursor = req.query.cursor as string | undefined;

    const filter: Record<string, unknown> = { chatId };

    if (cursor) {
        validateObjectIds(cursor);
        const cursorMsg = await Message.findById(cursor);
        if (!cursorMsg) {
            throw new AppError(400, "Invalid cursor message id");
        }

        filter.createdAt = { $lt: cursorMsg.createdAt };
    }

    const messages = await Message.find(filter)
        .sort({ createdAt: -1 })
        .limit(limit);

    const sanitized = messages.map(sanitizeMessage);

    return res.status(200).json({
        success: true,
        message: "Messages fetched successfully.",
        data: {
            messages: sanitized.reverse(),
            hasMore: messages.length === limit,
        },
    });
}

export async function handleGetNewMessages(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const userId = req.user!.id;

    const unreadMessages = await Message.find({
        to: userId,
        seen: false,
    });

    const newMessages: Record<string, number> = {};

    unreadMessages.forEach((msg) => {
        if (String(msg.from) in newMessages) {
            newMessages[String(msg.from)] += 1;
        } else {
            newMessages[String(msg.from)] = 1;
        }
    });

    return res.status(200).json({
        success: true,
        message: "New Messages fetched successfully.",
        data: {
            newMessages,
        },
    });
}

export async function handleMarkRead(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const msgId = req.params.msgId;

    const targetMsg = await markRead(String(req.user!._id), msgId);

    return res.status(200).json({
        success: true,
        message: "Message marked as read successfully.",
        data: {
            message: sanitizeMessage(targetMsg),
        },
    });
}
