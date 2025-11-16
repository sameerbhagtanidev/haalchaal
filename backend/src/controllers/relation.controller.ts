import Relation from "../models/relation.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import generateChatId from "../utils/generateChatId.util.js";

import { sanitizeRelation } from "../utils/sanitize.util.js";
import AppError from "../utils/AppError.util.js";
import { validateData, validateObjectIds } from "../utils/validate.util.js";
import * as schemas from "../validation/relation.schema.js";

import type { Request, Response, NextFunction } from "express";

export async function handleGetFriends(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = req.user;

    const friends = await Relation.find({
        $or: [
            { from: user!._id, status: "accepted" },
            { to: user!._id, status: "accepted" },
        ],
    })
        .populate("from", "_id username email isAdmin")
        .populate("to", "_id username email isAdmin");

    if (friends.length === 0) {
        return res.status(200).json({
            success: true,
            message: "You have no friends.",
            data: {
                friends: [],
            },
        });
    }

    return res.status(200).json({
        success: true,
        message: "Friends queried successfully.",
        data: {
            friends: friends.map(sanitizeRelation),
        },
    });
}

export async function handleRemoveFriend(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const relationId = req.params.relationId;
    validateObjectIds(relationId);

    const user = req.user;

    const friend = await Relation.findOne({
        $or: [
            {
                _id: relationId,
                from: user!._id,
            },
            {
                _id: relationId,
                to: user!._id,
            },
        ],
        status: "accepted",
    });

    if (!friend) {
        throw new AppError(404, "Friend not found!");
    }

    const fromId = String(friend.from);
    const toId = String(friend.to);

    const chatId = generateChatId(fromId, toId);

    await Message.deleteMany({ chatId });
    await friend.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Friend Removed successfully.",
    });
}

export async function handleGetRequests(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = req.user;

    const requests = await Relation.find({
        $or: [
            { from: user!._id, status: "pending" },
            { to: user!._id, status: "pending" },
        ],
    })
        .populate("from", "_id username email isAdmin")
        .populate("to", "_id username email isAdmin");

    if (requests.length === 0) {
        return res.status(200).json({
            success: true,
            message: "No pending requests!",
            data: {
                requests: [],
            },
        });
    }

    return res.status(200).json({
        success: true,
        message: "Pending requests queried successfully.",
        data: {
            requests: requests.map(sanitizeRelation),
        },
    });
}

export async function handleSendRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const validated = validateData(schemas.sendRequestSchema, req.body);
    const { username } = validated;
    const user = req.user;

    if (user!.username === username) {
        throw new AppError(400, "You cannot send a request to yourself.");
    }

    const to = await User.findOne({ username });
    if (!to) {
        throw new AppError(404, "User does not exist!");
    }

    const existingReq = await Relation.findOne({
        $or: [
            { from: user!._id, to: to._id },
            { from: to._id, to: user!._id },
        ],
    })
        .populate("from", "_id username email isAdmin")
        .populate("to", "_id username email isAdmin");

    if (existingReq) {
        if (existingReq.status === "accepted") {
            throw new AppError(400, "You're already friends!");
        } else {
            if (existingReq.from.equals(to._id)) {
                existingReq.status = "accepted";
                await existingReq.save();

                return res.status(200).json({
                    success: true,
                    message: "Friend request accepted successfully.",
                    data: {
                        request: sanitizeRelation(existingReq),
                    },
                });
            } else {
                throw new AppError(400, "You've already sent them a request!");
            }
        }
    }

    const newReq = new Relation({
        from: user!._id,
        to: to._id,
    });

    await newReq.save();

    const populatedReq = await Relation.findById(newReq._id)
        .populate("from", "_id username email isAdmin")
        .populate("to", "_id username email isAdmin");

    if (!populatedReq) {
        throw new AppError(500, "Failed to send request");
    }

    return res.status(201).json({
        success: true,
        message: "Friend request sent successfully.",
        data: {
            request: sanitizeRelation(populatedReq),
        },
    });
}

export async function handleDeleteRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const relationId = req.params.relationId;
    validateObjectIds(relationId);
    const user = req.user;

    const request = await Relation.findOne({
        _id: relationId,
        from: user!._id,
        status: "pending",
    });

    if (!request) {
        throw new AppError(404, "Request not found!");
    }

    await request.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Request Deleted successfully.",
    });
}

export async function handleResolveRequest(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const relationId = req.params.relationId;
    validateObjectIds(relationId);

    const validated = validateData(schemas.resolveRequestSchema, req.body);
    const { action } = validated;
    const user = req.user;

    const request = await Relation.findOne({
        _id: relationId,
        to: user!._id,
        status: "pending",
    })
        .populate("from", "_id username email isAdmin")
        .populate("to", "_id username email isAdmin");

    if (!request) {
        throw new AppError(404, "Request not found!");
    }

    if (action === "reject") {
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Friend request rejected",
            data: {
                request: sanitizeRelation(request),
            },
        });
    }

    request.status = "accepted";
    await request.save();

    return res.status(200).json({
        success: true,
        message: "Friend request accepted",
        data: {
            request: sanitizeRelation(request),
        },
    });
}
