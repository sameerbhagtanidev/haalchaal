import { Router } from "express";
const router = Router();

import {
    handleGetFriends,
    handleRemoveFriend,
    handleGetRequests,
    handleSendRequest,
    handleDeleteRequest,
    handleResolveRequest,
} from "../controllers/relation.controller.js";

import {
    requireAuth,
    requireOnboarded,
} from "../middlewares/auth.middleware.js";
import wrapAsync from "../utils/wrapAsync.util.js";

router.get(
    "/friends",
    requireAuth,
    requireOnboarded,
    wrapAsync(handleGetFriends)
);
router.delete(
    "/friends/:relationId",
    requireAuth,
    requireOnboarded,
    wrapAsync(handleRemoveFriend)
);

router
    .route("/requests")
    .get(requireAuth, requireOnboarded, wrapAsync(handleGetRequests))
    .post(requireAuth, requireOnboarded, wrapAsync(handleSendRequest));

router
    .route("/requests/:relationId")
    .delete(requireAuth, requireOnboarded, wrapAsync(handleDeleteRequest))
    .patch(requireAuth, requireOnboarded, wrapAsync(handleResolveRequest));

export default router;
