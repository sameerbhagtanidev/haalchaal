import type { IUser } from "../models/user.model.js";
import type { IRelation } from "../models/relation.model.js";
import type { IMessage } from "../models/message.model.js";

export function sanitizeUser(user: IUser) {
    return {
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin,
    };
}

export function sanitizeRelation(relation: IRelation) {
    return {
        _id: relation._id,
        from: relation.from,
        to: relation.to,

        status: relation.status,
    };
}

export function sanitizeMessage(message: IMessage) {
    return {
        _id: message._id,
        chatId: message.chatId,

        from: message.from,
        to: message.to,
        text: message.text,
        seen: message.seen,

        createdAt: message.createdAt,
    };
}
