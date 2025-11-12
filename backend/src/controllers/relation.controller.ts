import Relation from "../models/relation.model.js";
import User from "../models/user.model.js";

import { sanitizeRelation } from "../utils/sanitize.util.js";
import AppError from "../utils/AppError.util.js";

import type { Request, Response, NextFunction } from "express";

export async function handleGetFriends(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const user = req.user;

    const friends = await Relation.find({
        $or: [
            { fromUser: user!._id, status: "accepted" },
            { toUser: user!._id, status: "accepted" },
        ],
    })
        .populate("fromUser", "_id username email")
        .populate("toUser", "_id username email");

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
    const user = req.user;

    const friend = await Relation.findOne({
        $or: [
            {
                _id: relationId,
                fromUser: user!._id,
                status: "accepted",
            },
            {
                _id: relationId,
                toUser: user!._id,
                status: "accepted",
            },
        ],
    });

    if (!friend) {
        throw new AppError(404, "Friend not found!");
    }

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
            { fromUser: user!._id, status: "pending" },
            { toUser: user!._id, status: "pending" },
        ],
    })
        .populate("fromUser", "_id username email")
        .populate("toUser", "_id username email");

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
    const { username } = req.body;
    const user = req.user;

    if (user!.username === username) {
        throw new AppError(400, "You cannot send a request to yourself.");
    }

    const toUser = await User.findOne({ username });
    if (!toUser) {
        throw new AppError(404, "User does not exist!");
    }

    const existingReq = await Relation.findOne({
        $or: [
            { fromUser: user!._id, toUser: toUser._id },
            { fromUser: toUser._id, toUser: user!._id },
        ],
    })
        .populate("fromUser", "_id username email")
        .populate("toUser", "_id username email");

    if (existingReq) {
        if (existingReq.status === "accepted") {
            throw new AppError(400, "You're already friends!");
        } else {
            if (existingReq.fromUser.equals(toUser._id)) {
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
        fromUser: user!._id,
        toUser: toUser._id,
    });

    await newReq.save();

    const populatedReq = await Relation.findById(newReq._id)
        .populate("fromUser", "_id username email")
        .populate("toUser", "_id username email");

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
    const user = req.user;

    const request = await Relation.findOne({
        _id: relationId,
        fromUser: user!._id,
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
    const { action } = req.body;
    const user = req.user;

    const request = await Relation.findOne({
        _id: relationId,
        toUser: user!._id,
        status: "pending",
    })
        .populate("fromUser", "_id username email")
        .populate("toUser", "_id username email");

    if (!request) {
        throw new AppError(404, "Request not found!");
    }

    if (action === "reject") {
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Friend request rejected",
            data: {
                request,
            },
        });
    }

    request.status = "accepted";
    await request.save();

    return res.status(200).json({
        success: true,
        message: "Friend request accepted",
        data: {
            request,
        },
    });
}
