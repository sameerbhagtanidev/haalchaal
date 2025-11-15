import { Server } from "socket.io";
import cookie from "cookie";

import { decodeJWT } from "../utils/tokens.util.js";
import type { Server as ServerType } from "http";

import { connectionHandler } from "./handlers.js";

export const onlineUsers = new Map<string, Set<string>>();

export default function initWsServer(httpServer: ServerType) {
    const wsServer = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            credentials: true,
        },
    });

    wsServer.use((socket, next) => {
        try {
            const raw = socket.handshake.headers?.cookie;
            if (!raw) return next(new Error("Authentication error: no cookie"));

            const parsed = cookie.parse(raw);
            const token = parsed["haalchaal-token"];
            if (!token)
                return next(new Error("Authentication error: token not found"));

            const decoded = decodeJWT(token);
            if (!decoded)
                return next(new Error("Authentication error: invalid token"));

            socket.data.userId = decoded._id;
            return next();
        } catch (err) {
            return next(new Error("Authentication error"));
        }
    });

    wsServer.on("connection", (socket) => connectionHandler(wsServer, socket));
}
