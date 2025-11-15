import { Router } from "express";
const router = Router();

import {
    handleSendMessage,
    handleGetConversation,
    handleGetNewMessages,
    handleMarkRead,
} from "../controllers/message.controller.js";

import {
    requireAuth,
    requireOnboarded,
} from "../middlewares/auth.middleware.js";
import wrapAsync from "../utils/wrapAsync.util.js";

router.post("/", requireAuth, requireOnboarded, wrapAsync(handleSendMessage));

router.get(
    "/new",
    requireAuth,
    requireOnboarded,
    wrapAsync(handleGetNewMessages)
);

router.get(
    "/:otherId",
    requireAuth,
    requireOnboarded,
    wrapAsync(handleGetConversation)
);

router.patch(
    "/:msgId/read",
    requireAuth,
    requireOnboarded,
    wrapAsync(handleMarkRead)
);

export default router;
