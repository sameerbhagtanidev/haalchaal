import { onlineUsers } from "./wsServer.js";
import { saveMessage, markRead } from "../services/message.service.js";

import { sanitizeMessage } from "../utils/sanitize.util.js";
import wsErrorHandler from "../utils/wsErrorHandler.js";
import type { Socket } from "socket.io";
import type { Server } from "socket.io";

export function connectionHandler(io: Server, socket: Socket) {
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

    socket.on(
        "send_message",
        async (
            data: { message: string; toId: string },
            ack?: (res: any) => void
        ) => {
            try {
                const { message, toId } = data;
                const fromId = socket.data.userId as string;

                const newMsg = await saveMessage(
                    socket.data.userId,
                    toId,
                    message
                );
                const sanitized = sanitizeMessage(newMsg);

                const recipientSockets =
                    onlineUsers.get(toId) ?? new Set<string>();
                const senderSockets =
                    onlineUsers.get(fromId) ?? new Set<string>();

                const targets = new Set<string>([
                    ...recipientSockets,
                    ...senderSockets,
                ]);

                targets.delete(socket.id);

                if (targets) {
                    for (const sid of targets) {
                        io.to(sid).emit("receive_message", sanitized);
                    }
                }

                ack?.({
                    success: true,
                    message: "Message sent successfully.",
                    data: { message: sanitized },
                });
            } catch (err) {
                wsErrorHandler(err, ack);
            }
        }
    );

    socket.on("send_typing", (toId: string, ack?: (res: any) => void) => {
        try {
            const recipientSockets = onlineUsers.get(toId);
            const fromId = socket.data.userId;

            if (recipientSockets) {
                for (const sid of recipientSockets) {
                    io.to(sid).emit("receive_typing", fromId);
                }
            }
        } catch (err) {
            wsErrorHandler(err, ack);
        }
    });

    socket.on(
        "send_mark_read",
        async (msgId: string, ack?: (res: any) => void) => {
            try {
                const targetMsg = await markRead(socket.data.userId, msgId);
                const recipientSockets = onlineUsers.get(
                    String(targetMsg.from)
                );

                if (recipientSockets) {
                    for (const sid of recipientSockets) {
                        io.to(sid).emit(
                            "receive_mark_read",
                            String(targetMsg._id)
                        );
                    }
                }
            } catch (err) {
                wsErrorHandler(err, ack);
            }
        }
    );
}
