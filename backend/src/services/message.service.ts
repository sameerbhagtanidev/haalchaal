import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Relation from "../models/relation.model.js";

import AppError from "../utils/AppError.util.js";
import generateChatId from "../utils/generateChatId.util.js";

export async function saveMessage(fromId: string, toId: string, text: string) {
    if (fromId === toId) {
        throw new AppError(400, "You cannot send a message to yourself");
    }

    const toUser = await User.findById(toId);
    if (!toUser) {
        throw new AppError(404, "Friend not found");
    }

    const relation = await Relation.findOne({
        $or: [
            { from: fromId, to: toId },
            { from: toId, to: fromId },
        ],
        status: "accepted",
    });
    if (!relation) {
        throw new AppError(403, "You can only send messages to friends.");
    }

    const chatId = generateChatId(fromId, toId);

    const msg = await Message.create({
        chatId,
        from: fromId,
        to: toId,
        text: text.trim(),
    });

    return msg;
}

export async function markRead(userId: string, msgId: string) {
    const targetMsg = await Message.findById(msgId);
    if (!targetMsg) throw new AppError(404, "Message not found");

    const recipientId = String(targetMsg.to);
    if (recipientId !== userId) {
        throw new AppError(403, "Only recipient can mark message as read");
    }

    const chatId = targetMsg.chatId;
    const cutoff = targetMsg.createdAt;

    await Message.updateMany(
        {
            chatId,
            to: recipientId,
            createdAt: { $lte: cutoff },
            seen: false,
        },
        { $set: { seen: true } }
    );

    return targetMsg;
}
