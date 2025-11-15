// load env variables
import "dotenv/config";

// core requires
import express from "express";
import initWsServer from "./ws/wsServer.js";
import cors from "cors";
import cookieParser from "cookie-parser";

// app initialization
const app = express();

// DB connection
import { connectDB } from "./config/db.config.js";
connectDB();

// global middlewares
if (process.env.NODE_ENV === "development") {
    app.use(
        cors({
            origin: true,
            credentials: true,
        })
    );
} else {
    app.use(
        cors({
            origin: process.env.CLIENT_URL,
            credentials: true,
        })
    );
}

app.use(express.json());
app.use(cookieParser());

// custom middlewares
import { getUser } from "./middlewares/auth.middleware.js";
app.use(getUser);

// routes
import usersRouter from "./routes/users.route.js";
app.use("/api/users", usersRouter);

import relationsRouter from "./routes/relations.route.js";
app.use("/api/relations", relationsRouter);

import messagesRouter from "./routes/messages.route.js";
app.use("/api/messages", messagesRouter);

app.get("/api/ping", (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "All good!",
    });
});

// 404 handler
import AppError from "./utils/AppError.util.js";
app.all("*splat", (req, res, next) => {
    next(new AppError(404, "API endpoint not found!"));
});

// error handler
import appErrorHandler from "./utils/appErrorHandler.util.js";
app.use(appErrorHandler);

// http server
const PORT = Number(process.env.PORT) || 5000;
const httpServer = app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server started at PORT : ${PORT}`);
});

initWsServer(httpServer);
