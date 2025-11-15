import { Router } from "express";
const router = Router();

import {
    handleCheckUsername,
    handleStatus,
    handleSendToken,
    handleVerifyToken,
    handleOnboard,
    handleLogout,
    handleGoogleLogin,
    handleGoogleCallback,
    handleDeleteUser,
} from "../controllers/user.controller.js";

import {
    requireAuth,
    requireOnboarded,
    requireNotOnboarded,
    requireAdmin,
} from "../middlewares/auth.middleware.js";
import wrapAsync from "../utils/wrapAsync.util.js";

router.get("/check-username", wrapAsync(handleCheckUsername));
router.get("/status", wrapAsync(handleStatus));
router.post("/send-token", wrapAsync(handleSendToken));
router.post("/verify-token", wrapAsync(handleVerifyToken));
router.post(
    "/onboard",
    requireAuth,
    requireNotOnboarded,
    wrapAsync(handleOnboard)
);
router.post("/logout", wrapAsync(handleLogout));

router.get("/google", wrapAsync(handleGoogleLogin));
router.get("/google/callback", wrapAsync(handleGoogleCallback));

router.delete(
    "/:userId",
    requireAuth,
    requireOnboarded,
    requireAdmin,
    wrapAsync(handleDeleteUser)
);

export default router;
