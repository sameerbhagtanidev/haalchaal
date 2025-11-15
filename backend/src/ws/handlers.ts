import { onlineUsers } from "./wsServer.js";
import { saveMessage, markRead } from "../services/message.service.js";

import type { Socket } from "socket.io";
import type { Server } from "socket.io";
import { sanitizeMessage } from "../utils/sanitize.util.js";

export async function connectionHandler(io: Server, socket: Socket) {
    const userId = socket.data.userId;

    if (!onlineUsers.has(userId)) {
        onlineUsers.set(userId, new Set());
    }
    onlineUsers.get(userId)!.add(socket.id);

    socket.on("disconnect", () => {
        const userId = socket.data.userId;

        const userSockets = onlineUsers.get(userId);
        if (!userSockets) return;

        userSockets.delete(socket.id);
    });

    socket.on("send_message", async (data) => {
        const { message, toId } = data;
        const newMsg = await saveMessage(socket.data.userId, toId, message);

        const recipientSockets = onlineUsers.get(toId);

        socket.emit("receive_message", sanitizeMessage(newMsg));
        if (recipientSockets) {
            for (const sid of recipientSockets) {
                io.to(sid).emit("receive_message", sanitizeMessage(newMsg));
            }
        }
    });

    socket.on("send_typing", (toId) => {
        const recipientSockets = onlineUsers.get(toId);
        const fromId = socket.data.userId;

        if (recipientSockets) {
            for (const sid of recipientSockets) {
                io.to(sid).emit("receive_typing", fromId);
            }
        }
    });

    socket.on("send_mark_read", async (msgId) => {
        const newMsg = await markRead(socket.data.userId, msgId);

        const recipientSockets = onlineUsers.get(String(newMsg.from));

        if (recipientSockets) {
            for (const sid of recipientSockets) {
                io.to(sid).emit("receive_mark_read", String(newMsg._id));
            }
        }
    });
}
